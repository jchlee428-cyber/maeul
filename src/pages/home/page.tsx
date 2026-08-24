import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { communityResources, type CommunityResource } from "@/data/communityResources";
import { searchAndAnalyzePublicData, type RAGAnalysisResult, type PublicDataRecord } from "@/services/publicDataService";
import { checkAndHandleSimpleQueryAsync } from "@/services/simpleQueryService";
import { reviewAndRefineResponse, classifyUserIntent } from "@/services/geminiReviewEngine";
import { generateAISearchFallbackReply } from "@/services/aiSearchFallbackService";
import {
  saveConsultationSession,
  getConsultationHistory,
  clearAllConsultationHistory,
  deleteConsultationSession,
  type ConsultationRecord
} from "@/services/consultationHistoryService";
import {
  SUPPORTED_LANGUAGES,
  UI_TRANSLATIONS,
  getMultilingualWelcome,
  translateStepTitle,
  translateStepContent,
  convertToEasyKorean,
  translateTextToTargetLang
} from "@/services/multilingualEngine";
import { AVAILABLE_REGIONS, getVillageData } from "@/services/localAreaService";
import CustomGuideSheet from "@/components/CustomGuideSheet";
import HelpRequestModal from "@/components/HelpRequestModal";
import SchemaOrg from "@/seo/SchemaOrg";

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: { error: string }) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  ragResult?: RAGAnalysisResult;
  matchedResource?: CommunityResource;
}

function extractPhoneDigits(str: string): string | null {
  const match = str.match(/(?:0\d{1,2}-\d{3,4}-\d{4}|1[56]\d{2}-\d{4}|\b(?:119|112|129|110|1350|1332|1339|114|182)\b)/);
  if (match) {
    return match[0].replace(/[^0-9]/g, "");
  }
  const clean = str.replace(/[^0-9]/g, "");
  return clean.length >= 3 ? clean : null;
}

function renderTextWithPhoneLinks(rawText: string, keyPrefix: string) {
  // Regex matches: 📞 129, 📞 국번없이 129 (무료), 📞 031-590-2114, 1544-7788, 1666-5522, 119, 112, etc.
  const phonePattern = /((?:📞|☎️)?\s*(?:국번없이\s*)?(?:0\d{1,2}-\d{3,4}-\d{4}|1[56]\d{2}-\d{4}|\b(?:119|112|129|110|1350|1332|1339|114|182)\b)(?:\s*\([^)]+\))?)/g;
  const segments = rawText.split(phonePattern);

  return segments.map((seg, sIdx) => {
    if (!seg) return null;

    const digits = extractPhoneDigits(seg);
    const isPhoneMatch = digits && (
      seg.includes("📞") ||
      seg.includes("☎️") ||
      seg.includes("-") ||
      seg.includes("국번없이") ||
      ["119", "112", "129", "110", "1350", "182", "114"].some((n) => seg.includes(n))
    );

    if (isPhoneMatch) {
      return (
        <a
          key={`${keyPrefix}-phone-${sIdx}`}
          href={`tel:${digits}`}
          className="inline-flex items-center gap-1 font-black text-emerald-950 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 border border-emerald-400 px-2 py-0.5 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer text-xs sm:text-sm my-0.5 align-middle"
          title={`📞 ${digits} 전화 연결 (터치하면 바로 통화)`}
        >
          <span className="text-base text-emerald-700 animate-pulse shrink-0">📞</span>
          <span className="underline underline-offset-2">{seg.replace(/^[📞☎️]\s*/, "")}</span>
          <span className="text-[10px] bg-emerald-700 text-white font-extrabold px-1.5 py-0.2 rounded shrink-0 ml-0.5">전화걸기</span>
        </a>
      );
    }

    return <span key={`${keyPrefix}-txt-${sIdx}`}>{seg}</span>;
  });
}

function FormattedMessageText({ text }: { text: string }) {
  const lines = text.split("\n");

  const renderInline = (lineContent: string) => {
    // Regex matches: [link](url), **bold**, `code`
    const regex = /(\[.*?\]\(https?:\/\/.*?\)|\*\*.*?\*\*|`.*?`)/g;
    const parts = lineContent.split(regex);

    return parts.map((part, pIdx) => {
      if (!part) return null;

      // Link: [title](url)
      const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={pIdx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 hover:bg-emerald-50 px-1 py-0.5 rounded transition-colors"
          >
            <span>{linkMatch[1]}</span>
            <i className="ri-external-link-line text-xs"></i>
          </a>
        );
      }

      // Bold: **text**
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-extrabold text-emerald-950 bg-emerald-100/70 px-1 py-0.5 rounded">
            {renderTextWithPhoneLinks(part.slice(2, -2), `bold-${pIdx}`)}
          </strong>
        );
      }

      // Code: `code`
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={pIdx} className="px-1.5 py-0.5 bg-slate-100 text-emerald-800 font-mono text-xs rounded border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }

      return renderTextWithPhoneLinks(part, `norm-${pIdx}`);
    });
  };

  return (
    <div className="space-y-2 text-slate-900 text-sm sm:text-base leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Horizontal Rule: ---
        if (trimmed === "---" || trimmed === "***") {
          return <hr key={idx} className="my-3 border-t border-slate-200" />;
        }

        // Headers: #, ##, ###, ####
        if (trimmed.startsWith("#### ")) {
          return (
            <h5 key={idx} className="font-extrabold text-sm text-emerald-900 mt-2 mb-1">
              {renderInline(trimmed.slice(5))}
            </h5>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-extrabold text-base text-emerald-950 mt-3 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block shrink-0"></span>
              <span>{renderInline(trimmed.slice(4))}</span>
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-black text-lg text-emerald-950 mt-4 mb-1.5 border-b border-emerald-100 pb-1">
              {renderInline(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={idx} className="font-black text-xl text-emerald-950 mt-4 mb-2">
              {renderInline(trimmed.slice(2))}
            </h2>
          );
        }

        // Blockquotes: >
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={idx} className="border-l-4 border-emerald-500 pl-3 py-1 bg-emerald-50/60 rounded-r-lg my-1.5 italic text-slate-800 text-sm">
              {renderInline(trimmed.slice(2))}
            </blockquote>
          );
        }

        // Bullet Lists: - or *
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-0.5">
              <span className="text-emerald-600 font-bold mt-1 text-xs shrink-0">•</span>
              <div className="flex-1">{renderInline(trimmed.slice(2))}</div>
            </div>
          );
        }

        // Numbered Lists: 1. 2.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-0.5">
              <span className="font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded text-xs shrink-0 mt-0.5">
                {numMatch[1]}
              </span>
              <div className="flex-1">{renderInline(numMatch[2])}</div>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedVillageCode, setSelectedVillageCode] = useState("pyeongnae");
  const [selectedLang, setSelectedLang] = useState("ko");
  const [isEasyKorean, setIsEasyKorean] = useState(false);

  useEffect(() => {
    if (location.hash === "#faq") {
      navigate("/faq", { replace: true });
    } else if (location.hash === "#intro" || location.hash === "#about") {
      navigate("/intro", { replace: true });
    }
  }, [location.hash, navigate]);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedGuideResource, setSelectedGuideResource] = useState<CommunityResource | null>(null);

  // 음성인식 (STT) 상태
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // 음성출력 (TTS) 상태
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speakingStepNum, setSpeakingStepNum] = useState<number | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // 도움 요청 모달 상태
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [targetPublicData, setTargetPublicData] = useState<PublicDataRecord | null>(null);
  const [currentQueryContext, setCurrentQueryContext] = useState("");

  // 상담 기록 DB 모달 상태
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState<ConsultationRecord[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const village = getVillageData(selectedVillageCode);

  const loadHistory = () => {
    setConsultationHistory(getConsultationHistory());
  };

  // 초기 환영 메시지 (LOCAL FIRST & 다국어 반영)
  const resetToWelcome = (targetLang = selectedLang) => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
    setSpeakingStepNum(null);
    setInput("");
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: getMultilingualWelcome(village.name, village.fullName, targetLang)
      }
    ]);
  };

  useEffect(() => {
    loadHistory();
    resetToWelcome();

    // 음성인식 초기화
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRecognitionClass =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang === "ko" ? "ko-KR" : selectedLang;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from({ length: 1 }, (_, i) => event.results[i][0].transcript).join("");
        setInput(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (activeAudioRef.current) activeAudioRef.current.pause();
    };
  }, [selectedVillageCode, selectedLang]);

  // 스크롤 자동 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // 마이크 토글
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("현재 브라우저에서는 마이크 기능이 지원되지 않습니다. 아래 입력창에 글자로 적어주세요.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("STT start error", err);
      }
    }
  };

  // 모바일 & 인앱 브라우저 호환 하이브리드 TTS
  const playMobileTTS = (text: string, onStart: () => void, onEnd: () => void) => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    const cleanText = text
      .replace(/[#*`💡📌📞🛡️🔒📍🚊🚆🚌🚕🚑👮🏛️🏫•👵🏥🏠💼]/g, " ")
      .replace(/➔/g, "에서 ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    const playOnlineAudioFallback = () => {
      try {
        const encoded = encodeURIComponent(cleanText.slice(0, 200));
        const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${selectedLang}&client=tw-ob`);
        activeAudioRef.current = audio;
        audio.onplay = onStart;
        audio.onended = () => { activeAudioRef.current = null; onEnd(); };
        audio.onerror = () => { activeAudioRef.current = null; onEnd(); };
        audio.play().catch(() => onEnd());
      } catch {
        onEnd();
      }
    };

    if (!("speechSynthesis" in window) || !window.speechSynthesis) {
      playOnlineAudioFallback();
      return;
    }

    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.cancel();

      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = selectedLang === "ko" ? "ko-KR" : selectedLang;
          utterance.rate = 0.88;
          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find((v) => v.lang.startsWith(selectedLang));
          if (voice) utterance.voice = voice;

          utterance.onstart = onStart;
          utterance.onend = onEnd;
          utterance.onerror = () => playOnlineAudioFallback();

          window.speechSynthesis.speak(utterance);
        } catch {
          playOnlineAudioFallback();
        }
      }, 50);
    } catch {
      playOnlineAudioFallback();
    }
  };

  // 4단계 전체 낭독
  const speakAll4Steps = (msgId: string, rag: RAGAnalysisResult) => {
    if (speakingMsgId === `full-${msgId}`) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      setSpeakingStepNum(null);
      return;
    }

    const narrative = [
      `안녕하세요, 마을지기예요. 주민님께서 겪고 계신 상황에 대해 4단계 맞춤 지원 안내를 차근차근 읽어드릴게요.`,
      `1단계, 따뜻한 공감과 상황 확인입니다. ${rag.groundedSteps[0]?.content || ""}`,
      `2단계, 딱 맞는 공공 지원 제도입니다. ${rag.groundedSteps[1]?.content || ""}`,
      `3단계, 주민님이 실제로 하셔야 할 행동 순서입니다. ${rag.groundedSteps[2]?.content || ""}`,
      `4단계, 안심 확인과 사람 연결 안내입니다. ${rag.groundedSteps[3]?.content || ""}`
    ].join(". ");

    playMobileTTS(
      narrative,
      () => setSpeakingMsgId(`full-${msgId}`),
      () => { setSpeakingMsgId(null); setSpeakingStepNum(null); }
    );
  };

  // 단일 스텝 낭독
  const speakSingleStep = (stepNum: number, title: string, content: string) => {
    if (speakingStepNum === stepNum) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setSpeakingStepNum(null);
      setSpeakingMsgId(null);
      return;
    }

    const text = `${stepNum}단계, ${title} 내용입니다. ${content}`;
    playMobileTTS(
      text,
      () => { setSpeakingStepNum(stepNum); setSpeakingMsgId(`step-${stepNum}`); },
      () => setSpeakingStepNum(null)
    );
  };

  // 단순 챗봇 멘트 낭독
  const speakSimpleMessage = (msgId: string, textToSpeak: string) => {
    if (speakingMsgId === msgId) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    playMobileTTS(
      textToSpeak.slice(0, 350),
      () => setSpeakingMsgId(msgId),
      () => setSpeakingMsgId(null)
    );
  };

  const analyzeAndRespond = async (query: string) => {
    setIsThinking(true);

    const intent = classifyUserIntent(query);
    const isWelfareDomain = ["care_mobility", "welfare_emergency", "medical_health", "housing_energy", "job_income"].includes(intent.category);
    const hasWelfareKeyword = (
      query.includes("신청") || query.includes("지원") || query.includes("급여") || query.includes("생계") ||
      query.includes("수술") || query.includes("병원") || query.includes("월세") || query.includes("실직") ||
      query.includes("돌봄") || query.includes("바우처") || query.includes("어르신") || query.includes("도움") ||
      query.includes("어려") || query.includes("힘들") || query.includes("막막") || query.includes("수당")
    ) && !query.includes("버스") && !query.includes("지하철") && !query.includes("강좌") && !query.includes("수강신청") && !query.includes("pyeongnae") && !query.includes("nyj.go.kr") && !query.includes("남양주시청");

    // =========================================================================
    // 1순위 (최우선): [복지·생계·의료·돌봄·주거·긴급지원 공공데이터 RAG 맞춤 분석]
    // =========================================================================
    const matchedRag = searchAndAnalyzePublicData(query);
    if (matchedRag) {
      setTimeout(() => {
        const matchedRes = communityResources.find((r) => r.category === matchedRag.matchedPublicData.category) || communityResources[0];
        let draftText = `말씀해주셔서 정말 감사해요. 힘드신 이야기를 편하게 나눠주셔서 고마워요.\n\n공공데이터포털 연계 [${matchedRag.matchedPublicData.serviceName}] 공식 정보를 확인하여 어르신과 주민의 눈높이에 맞춰 알기 쉽게 4단계로 정리해드렸어요.`;

        if (isEasyKorean) draftText = convertToEasyKorean(draftText);
        const reviewed = reviewAndRefineResponse(query, draftText, matchedRag);
        const finalRag = reviewed.ragRefinement || matchedRag;

        let finalText = reviewed.reviewedText;
        if (selectedLang !== "ko") {
          finalText = translateTextToTargetLang(finalText, selectedLang);
        }

        saveConsultationSession({
          userQuery: query,
          matchedServiceName: finalRag.matchedPublicData.serviceName,
          categoryLabel: finalRag.matchedPublicData.categoryLabel,
          replyText: finalText,
          ragResult: finalRag
        });
        loadHistory();

        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: "bot",
            text: finalText,
            ragResult: finalRag,
            matchedResource: matchedRes
          }
        ]);
        setIsThinking(false);
      }, 350);
      return;
    }

    // =========================================================================
    // 2순위: [평내동 주민자치센터(pyeongnae.co.kr), 실시간 교통(버스/지하철), 관공서 연락처]
    // =========================================================================
    try {
      const simpleResponse = await checkAndHandleSimpleQueryAsync(query);
      if (simpleResponse && simpleResponse.isSimple) {
        let reviewedText = reviewAndRefineResponse(query, simpleResponse.replyText).reviewedText;
        if (isEasyKorean) reviewedText = convertToEasyKorean(reviewedText);
        if (selectedLang !== "ko") reviewedText = translateTextToTargetLang(reviewedText, selectedLang);

        saveConsultationSession({
          userQuery: query,
          matchedServiceName: "생활안내 및 평내동/교통/기관 정보",
          categoryLabel: "생활안내",
          replyText: reviewedText
        });
        loadHistory();

        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: "bot",
            text: reviewedText
          }
        ]);
        setIsThinking(false);
        return;
      }
    } catch (e) {
      console.warn("Simple query lookup error", e);
    }

    // =========================================================================
    // 3순위: [기존 도구로 찾기 어려운 복합 질문 / 일반 질문 ➔ OpenAI (GPT-4o-mini) 스마트 검색]
    // =========================================================================
    try {
      const aiFallbackText = await generateAISearchFallbackReply(query, {
        userVillage: village.fullName,
        userLang: selectedLang
      });

      let reviewedText = aiFallbackText;
      if (isEasyKorean) reviewedText = convertToEasyKorean(reviewedText);
      if (selectedLang !== "ko") reviewedText = translateTextToTargetLang(reviewedText, selectedLang);

      saveConsultationSession({
        userQuery: query,
        matchedServiceName: "AI 스마트 검색 (OpenAI 연계)",
        categoryLabel: "AI 스마트검색",
        replyText: reviewedText
      });
      loadHistory();

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: "bot",
          text: reviewedText
        }
      ]);
    } catch (err) {
      console.error("AI Fallback execution error", err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    let q = (textToSend !== undefined ? textToSend : input).trim();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (!q) {
      q = "도움이 필요해요";
    }

    setMessages((prev) => [
      ...prev.filter((msg) => msg.id !== "welcome"),
      {
        id: String(Date.now()),
        sender: "user",
        text: q
      }
    ]);
    setInput("");
    analyzeAndRespond(q);
  };

  const openHelpRequest = (pubData: PublicDataRecord, userQuery: string) => {
    setTargetPublicData(pubData);
    setCurrentQueryContext(userQuery);
    setIsHelpModalOpen(true);
  };

  const handleLoadPastConsultation = (rec: ConsultationRecord) => {
    if (!rec.ragResult) {
      setMessages([
        { id: `past-user-${rec.id}`, sender: "user", text: rec.userQuery },
        { id: `past-bot-${rec.id}`, sender: "bot", text: `[📁 불러온 안내 기록: ${rec.timestamp}]\n\n${rec.replyText || rec.userQuery}` }
      ]);
    } else {
      const matchedRes = communityResources.find((r) => r.category === rec.ragResult!.matchedPublicData.category) || communityResources[0];
      setMessages([
        { id: `past-user-${rec.id}`, sender: "user", text: rec.userQuery },
        {
          id: `past-bot-${rec.id}`,
          sender: "bot",
          text: `[📁 불러온 상담 기록: ${rec.timestamp}]\n\n${rec.replyText || "저장된 4단계 맞춤 안내 기록입니다."}`,
          ragResult: rec.ragResult,
          matchedResource: matchedRes
        }
      ]);
    }
    setIsHistoryModalOpen(false);
  };

  return (
    <>
      <SchemaOrg />
      <main className="w-full h-[100dvh] max-h-[100dvh] bg-slate-100 flex flex-col overflow-hidden text-slate-900">
        {/* 1. 상단 딥그린 헤더 (LOCAL FIRST 지역선택 & 다국어 & 쉬운 한국어 탑재) */}
        <header className="w-full px-2.5 sm:px-6 py-2 sm:py-3 bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md shrink-0 z-20">
          <div className="flex items-center justify-between w-full sm:w-auto">
            {/* 좌측 로고 */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 whitespace-nowrap">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base sm:text-lg shadow shrink-0">
                <i className="ri-heart-3-fill"></i>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-heading font-black text-base sm:text-lg text-white tracking-tight whitespace-nowrap">
                  마을지기 AI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-black bg-emerald-950 text-amber-300 rounded border border-amber-300/40 shrink-0">
                  {village.name}
                </span>
              </div>
            </div>

            {/* 모바일 우측 빠른 액션 */}
            <div className="flex items-center gap-1 sm:hidden">
              <button
                type="button"
                onClick={() => {
                  if (confirm("새 대화를 시작할까요?")) resetToWelcome();
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-bold"
              >
                새 대화
              </button>
              <button
                type="button"
                onClick={() => { loadHistory(); setIsHistoryModalOpen(true); }}
                className="px-2 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold font-mono"
              >
                📁 {consultationHistory.length}
              </button>
            </div>
          </div>

          {/* 중앙 & 우측: LOCAL FIRST 지역 선택기 + 10개국 다국어 + 쉬운한국어 스위치 */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* 1. 지역 선택 (충분히 넓혀서 '평내동' 안 잘리게 설정) */}
            <select
              value={selectedVillageCode}
              onChange={(e) => setSelectedVillageCode(e.target.value)}
              className="flex-1 sm:flex-none min-w-[105px] px-2.5 sm:px-3 py-1.5 bg-emerald-950 text-emerald-200 border border-emerald-700 rounded-xl text-xs font-black focus:outline-none shrink-0 cursor-pointer shadow-xs"
              title="우리 동네 마을 선택"
            >
              {AVAILABLE_REGIONS[0].townships[0].villages.map((v) => (
                <option key={v.code} value={v.code}>
                  📍 {v.name}
                </option>
              ))}
            </select>

            {/* 2. 10개 다국어 선택 (슬림하고 콤팩트하게 줄임) */}
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-auto max-w-[90px] sm:max-w-none px-2 py-1.5 bg-emerald-950 text-amber-300 border border-emerald-700 rounded-xl text-xs font-black focus:outline-none shrink-0 cursor-pointer shadow-xs"
              title="언어 선택 (10개 다국어)"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>

            {/* 3. 쉬운 한국어 토글 버튼 */}
            <button
              type="button"
              onClick={() => setIsEasyKorean(!isEasyKorean)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all shrink-0 border whitespace-nowrap shadow-xs ${
                isEasyKorean
                  ? "bg-amber-400 text-slate-950 border-amber-500 shadow-sm"
                  : "bg-emerald-950/80 text-emerald-200 border-emerald-700 hover:bg-emerald-950"
              }`}
              title="어려운 행정용어를 쉬운 말로 풀어서 설명합니다"
            >
              {isEasyKorean ? "✨ 쉬운말" : "쉬운말 OFF"}
            </button>

            {/* 데스크톱 버튼 그룹 */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (confirm("현재 대화를 비우고 '새 대화'를 시작할까요?")) resetToWelcome();
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs font-black shadow ring-1 ring-emerald-300/80"
              >
                <i className="ri-refresh-line"></i>
                <span>새 대화</span>
              </button>

              <button
                type="button"
                onClick={() => { loadHistory(); setIsHistoryModalOpen(true); }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow"
              >
                <i className="ri-folder-history-fill"></i>
                <span className="font-mono">{consultationHistory.length}</span>
              </button>

              <Link
                to="/dashboard"
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white"
                title="우리 동네 대시보드"
              >
                <i className="ri-dashboard-3-line text-base"></i>
              </Link>
            </div>
          </div>
        </header>

        {/* 2. 5대 주요 서비스 원터치 바로가기 탭 바 */}
        <div className="bg-emerald-800/90 text-white px-2.5 sm:px-6 py-1.5 shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
          <span className="text-amber-300 font-extrabold whitespace-nowrap mr-1">
            <i className="ri-compass-3-line"></i> 바로가기:
          </span>
          <Link to="/dashboard" className="px-2.5 py-1 rounded-md bg-emerald-950/70 hover:bg-emerald-950 whitespace-nowrap">
            📊 동네 대시보드
          </Link>
          <Link to="/welfare" className="px-2.5 py-1 rounded-md bg-blue-900/80 hover:bg-blue-900 whitespace-nowrap text-blue-200">
            🎯 맞춤 지원 자가진단
          </Link>
          <Link to="/docs" className="px-2.5 py-1 rounded-md bg-emerald-950/70 hover:bg-emerald-950 whitespace-nowrap">
            📄 공문서 쉽게 보기
          </Link>
          <Link to="/market" className="px-2.5 py-1 rounded-md bg-amber-950/80 hover:bg-amber-950 whitespace-nowrap text-amber-300">
            🏪 동네 가게 & AI 홍보
          </Link>
          <Link to="/guide" className="px-2.5 py-1 rounded-md bg-emerald-950/70 hover:bg-emerald-950 whitespace-nowrap">
            📋 자원 가이드
          </Link>
        </div>

        {/* 3. 중앙 대화 스트림 영역 */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4 bg-slate-100 overscroll-y-contain">
          <div className="max-w-4xl mx-auto space-y-4 pb-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[94%] sm:max-w-[85%] rounded-2xl p-4 sm:p-6 shadow-md text-base sm:text-lg leading-relaxed break-keep ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white font-bold rounded-br-none"
                      : "bg-white text-slate-900 border-2 border-emerald-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 overflow-hidden">
                      <FormattedMessageText text={m.text} />
                    </div>
                    {m.sender === "bot" && (
                      <button
                        type="button"
                        onClick={() => speakSimpleMessage(m.id, m.text)}
                        className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all border-2 ${
                          speakingMsgId === m.id
                            ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs"
                        }`}
                        title="소리로 읽어주기"
                      >
                        <i className={speakingMsgId === m.id ? "ri-stop-fill" : "ri-volume-up-fill text-emerald-700"}></i>
                        <span>{speakingMsgId === m.id ? "멈춤" : "듣기"}</span>
                      </button>
                    )}
                  </div>

                  {/* 공공데이터 9단계 표준 답변 카드 영역 (Section 6 & 16) */}
                  {m.ragResult && (
                    <div className="mt-4 pt-4 border-t-2 border-slate-200 space-y-3.5">
                      {/* 음성 안내 배너 */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 border-2 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm">
                        <div className="text-slate-950">
                          <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1 text-amber-950">
                            <i className="ri-sound-module-line"></i> {UI_TRANSLATIONS.stepAudioBannerTitle?.[selectedLang] || "4단계 맞춤 음성 안내"}
                          </div>
                          <div className="font-heading font-black text-sm sm:text-base mt-0.5">
                            {UI_TRANSLATIONS.stepAudioBannerDesc?.[selectedLang] || "4단계 안내를 목소리로 들으시겠어요?"}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakAll4Steps(m.id, m.ragResult!)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all shrink-0 ${
                            speakingMsgId === `full-${m.id}`
                              ? "bg-rose-600 text-white animate-pulse"
                              : "bg-emerald-900 hover:bg-emerald-950 text-white"
                          }`}
                        >
                          <i className={speakingMsgId === `full-${m.id}` ? "ri-stop-circle-fill text-base" : "ri-volume-up-fill text-amber-300 text-base"}></i>
                          <span>{speakingMsgId === `full-${m.id}` ? (UI_TRANSLATIONS.audioStop?.[selectedLang] || "낭독 멈춤") : (UI_TRANSLATIONS.listenAll4Steps?.[selectedLang] || "4단계 전체 듣기")}</span>
                        </button>
                      </div>

                      {/* 공식 출처 및 확인일 배지 (Section 5 필수) */}
                      {m.ragResult.sources && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <span className="font-extrabold text-slate-900 flex items-center gap-1">
                              <i className="ri-verified-badge-fill text-emerald-600"></i>
                              {UI_TRANSLATIONS.officialSourceLabel?.[selectedLang] || "공식 출처"}: {m.ragResult.sources.sourceApi || "공공데이터포털 / 남양주시청"}
                            </span>
                            <span className="text-slate-600 block text-xs mt-0.5">
                              소관: {m.ragResult.sources.department || "남양주시 평내동 종합행정복지센터"} (확인일: 2026-08-20)
                            </span>
                          </div>
                          <a
                            href={`tel:${extractPhoneDigits(m.ragResult.sources.inquiryContact || village.communityCenterPhone) || "129"}`}
                            className="text-xs sm:text-sm px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-400 text-emerald-950 rounded-xl font-extrabold inline-flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                            title="터치하여 즉시 전화 걸기"
                          >
                            <span className="text-base text-emerald-700 animate-pulse shrink-0">📞</span>
                            <span className="underline underline-offset-2">
                              {UI_TRANSLATIONS.inquiryContactLabel?.[selectedLang] || "문의"}: {m.ragResult.sources.inquiryContact || village.communityCenterPhone}
                            </span>
                            <span className="text-[10px] bg-emerald-700 text-white font-black px-1.5 py-0.5 rounded ml-0.5 shrink-0">전화걸기</span>
                          </a>
                        </div>
                      )}

                      {/* 4단계 스텝 카드 그리드 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm sm:text-base">
                        {(m.ragResult.groundedSteps || []).map((st) => {
                          const translatedTitle = translateStepTitle(st.title, selectedLang);
                          const translatedContent = translateStepContent(st.content, st.stepNum, selectedLang);

                          return (
                            <div
                              key={st.stepNum}
                              className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all shadow-sm ${
                                speakingStepNum === st.stepNum
                                  ? "bg-amber-100 border-amber-500 ring-4 ring-amber-300"
                                  : st.stepNum === 1
                                  ? "bg-emerald-50 border-emerald-300"
                                  : st.stepNum === 2
                                  ? "bg-blue-50 border-blue-300"
                                  : st.stepNum === 3
                                  ? "bg-amber-50 border-amber-300"
                                  : "bg-purple-50 border-purple-300"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between font-extrabold text-slate-950 mb-2">
                                  <span className="flex items-center gap-2 font-heading text-sm sm:text-base">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-black shrink-0 ${
                                      st.stepNum === 1 ? "bg-emerald-600" :
                                      st.stepNum === 2 ? "bg-blue-600" :
                                      st.stepNum === 3 ? "bg-amber-600" : "bg-purple-600"
                                    }`}>
                                      {st.stepNum}
                                    </span>
                                    <span>{translatedTitle}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => speakSingleStep(st.stepNum, translatedTitle, translatedContent)}
                                    className={`p-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                                      speakingStepNum === st.stepNum
                                        ? "bg-rose-500 text-white animate-pulse"
                                        : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-300"
                                    }`}
                                    title={`${st.stepNum}단계 소리로 듣기`}
                                  >
                                    <i className={speakingStepNum === st.stepNum ? "ri-stop-fill text-sm" : "ri-volume-up-fill text-sm text-emerald-700"}></i>
                                  </button>
                                </div>
                                <div className="text-slate-900 leading-relaxed text-sm sm:text-base font-medium">
                                  <FormattedMessageText text={isEasyKorean ? convertToEasyKorean(translatedContent) : translatedContent} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 원클릭 도움 요청 & 인쇄 액션 바 */}
                      <div className="mt-3.5 pt-3 border-t-2 border-slate-200 flex flex-col sm:flex-row gap-2.5">
                        {m.ragResult.matchedPublicData && (
                          <button
                            type="button"
                            onClick={() => openHelpRequest(m.ragResult!.matchedPublicData, m.text)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-md transition-all active:scale-98"
                          >
                            <i className="ri-hand-heart-fill text-lg"></i>
                            <span>{UI_TRANSLATIONS.helpRequestAction?.[selectedLang] || "이 지원에 도움 요청하기 (마을관리자 연계)"}</span>
                          </button>
                        )}

                        {m.matchedResource && (
                          <button
                            type="button"
                            onClick={() => setSelectedGuideResource(m.matchedResource!)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs sm:text-sm shadow transition-colors"
                          >
                            <i className="ri-printer-line text-base"></i>
                            <span>{UI_TRANSLATIONS.printA4Guide?.[selectedLang] || "A4 안내서 인쇄"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2.5 text-slate-700 text-sm sm:text-base p-4 bg-white rounded-2xl border-2 border-emerald-200 w-fit shadow-md">
                <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping"></span>
                <span className="font-bold">[{village.name}] 공공데이터에서 알기 쉬운 맞춤 정보를 찾고 있어요...</span>
              </div>
            )}
          </div>
        </div>

        {/* 음성 인식 중 표시 바 */}
        {isListening && (
          <div className="px-4 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-between text-xs sm:text-sm font-bold shrink-0 shadow-inner z-10">
            <div className="flex items-center gap-2 truncate">
              <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping shrink-0"></span>
              <span className="truncate text-sm sm:text-base font-bold">🎙️ 귀 기울여 듣고 있어요... 편하게 말씀하세요!</span>
            </div>
            <button
              type="button"
              onClick={toggleListening}
              className="px-3 py-1.5 bg-white text-rose-700 hover:bg-rose-50 font-black rounded-xl text-xs sm:text-sm shadow transition-all shrink-0 ml-2"
            >
              말씀 끝내기 (전송)
            </button>
          </div>
        )}

        {/* 하단 2단 스마트 입력 영역 */}
        <div className="p-3 sm:p-5 bg-white border-t-2 border-emerald-300 shrink-0 shadow-2xl z-10 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-4xl mx-auto space-y-2.5">
            {/* 1단: 텍스트 입력창 + 상담하기 전송 버튼 */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center min-w-0">
                <span className="absolute left-3.5 text-emerald-700 text-lg flex items-center pointer-events-none">
                  <i className="ri-edit-2-fill"></i>
                </span>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      handleSendMessage();
                    }
                  }}
                  placeholder={isListening ? (UI_TRANSLATIONS.voiceListening?.[selectedLang] || "🎙️ 말씀하시는 중입니다...") : `[${village.name}] ${UI_TRANSLATIONS.askInputPlaceholder?.[selectedLang] || "질문을 적어주세요"}`}
                  className={`w-full pl-10 pr-10 py-3 sm:py-3.5 bg-white border-2 rounded-2xl text-base font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none transition-all shadow-sm ${
                    isListening
                      ? "border-rose-500 bg-rose-50 ring-4 ring-rose-200"
                      : "border-emerald-500 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-200"
                  }`}
                />

                {input.length > 0 && !isListening && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs transition-colors"
                    title="지우기"
                  >
                    <i className="ri-close-line text-sm font-bold"></i>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-7 py-3 sm:py-3.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-black rounded-2xl transition-all text-sm sm:text-base whitespace-nowrap shadow-md ring-2 ring-emerald-300 shrink-0"
              >
                <i className="ri-send-plane-fill text-base sm:text-lg text-amber-300"></i>
                <span className="font-black">{UI_TRANSLATIONS.sendButton?.[selectedLang] || "상담하기"}</span>
              </button>
            </div>

            {/* 2단: 어르신용 [🎙️ 목소리로 말하기] 초대형 54px 풀-너비 버튼 */}
            <button
              type="button"
              onClick={toggleListening}
              className={`w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform active:scale-98 border-2 ${
                isListening
                  ? "bg-gradient-to-r from-rose-500 to-red-600 text-white border-rose-600 ring-4 ring-rose-300 animate-pulse"
                  : "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 text-slate-950 border-amber-500 ring-2 ring-amber-300"
              }`}
              title={isListening ? "음성 인식 중지" : "마이크로 말하기"}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md shrink-0 ${
                isListening ? "bg-white text-rose-600 animate-bounce" : "bg-white text-orange-600"
              }`}>
                <i className={isListening ? "ri-mic-fill" : "ri-mic-2-fill"}></i>
              </span>
              <span className="tracking-tight truncate font-extrabold text-sm sm:text-base">
                {isListening ? (UI_TRANSLATIONS.voiceListening?.[selectedLang] || "말씀 듣는 중...") : (UI_TRANSLATIONS.voiceButton?.[selectedLang] || "🎙️ [목소리로 말하기] 눌러서 질문하기")}
              </span>
            </button>

            <p className="text-center text-[11px] sm:text-xs text-slate-600 font-medium leading-tight tracking-[-0.08em] sm:tracking-normal">
              {UI_TRANSLATIONS.privacyNotice?.[selectedLang] || "🔒 개인정보는 일체 저장되지 않습니다. 위급 상황 시 119 · 112"}
            </p>
          </div>
        </div>
      </main>

      {/* 지난 상담 기록 DB 모달 */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <i className="ri-folder-history-fill text-amber-300 text-xl"></i>
                <h3 className="font-heading font-black text-base sm:text-lg">지난 상담 및 안내 기록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white"
              >
                <i className="ri-close-line text-xl font-bold"></i>
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50">
              {consultationHistory.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm sm:text-base">
                  <i className="ri-inbox-line text-4xl text-slate-300 block mb-2"></i>
                  저장된 상담 기록이 없습니다.
                </div>
              ) : (
                consultationHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadPastConsultation(item)}
                    className="p-4 bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-start justify-between gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {item.categoryLabel || "안내"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{item.timestamp}</span>
                      </div>
                      <h4 className="font-black text-sm sm:text-base text-slate-900 truncate group-hover:text-emerald-800">
                        {item.userQuery}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-1">
                        {item.matchedServiceName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConsultationSession(item.id);
                        loadHistory();
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="삭제"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                ))
              )}
            </div>

            {consultationHistory.length > 0 && (
              <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("모든 상담 기록을 삭제하시겠습니까?")) {
                      clearAllConsultationHistory();
                      loadHistory();
                    }
                  }}
                  className="text-xs sm:text-sm text-rose-600 hover:underline font-bold"
                >
                  기록 전체 비우기
                </button>
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm font-bold text-slate-800"
                >
                  닫기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 도움 요청 모달 */}
      <HelpRequestModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        publicData={targetPublicData}
        userQuery={currentQueryContext}
        onSuccess={() => {}}
      />

      {/* 맞춤 안내서 A4 인쇄 모달 */}
      <CustomGuideSheet
        resource={selectedGuideResource}
        userQuery={currentQueryContext}
        onClose={() => setSelectedGuideResource(null)}
      />
    </>
  );
}