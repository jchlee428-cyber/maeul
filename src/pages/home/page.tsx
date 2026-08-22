import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { communityResources, type CommunityResource } from "@/data/communityResources";
import { searchAndAnalyzePublicData, type RAGAnalysisResult, type PublicDataRecord } from "@/services/publicDataService";
import { checkAndHandleSimpleQueryAsync } from "@/services/simpleQueryService";
import { reviewAndRefineResponse } from "@/services/geminiReviewEngine";
import {
  saveConsultationSession,
  getConsultationHistory,
  clearAllConsultationHistory,
  deleteConsultationSession,
  type ConsultationRecord
} from "@/services/consultationHistoryService";
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

function FormattedMessageText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-2" />;
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className="leading-relaxed text-slate-900">
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-extrabold text-emerald-950 bg-emerald-100/70 px-1 py-0.5 rounded">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

const quickQueries = [
  "👵 어르신 식사·돌봄 지원",
  "🏥 수술비·병원비 돌려받기",
  "🏠 월세·생계비 긴급 지원",
  "🚌 남양주 땡큐버스 위치",
  "🏛️ 동주민센터 전화번호",
  "🏫 초·중·고교 직통 연락처",
  "💼 취업 구직촉진수당"
];

export default function Home() {
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

  // 안내/원칙 모달 상태
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadHistory = () => {
    setConsultationHistory(getConsultationHistory());
  };

  // 초기 환영 메시지 (큰 글씨, 쉬운 말)
  const resetToWelcome = () => {
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
        text: "안녕하세요! 저는 우리 동네를 돕는 따뜻한 AI 이웃 도우미 **'마을지기'**예요. 😊\n\n병원비, 생계비, 어르신 돌봄, 버스나 주민센터 전화번호 등 무엇이든 편하게 물어보세요.\n\n이름이나 주민번호 같은 개인정보는 **절대 묻지 않으니** 안심하고 말씀하세요!"
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
      recognition.lang = "ko-KR";

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
  }, []);

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
        const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ko&client=tw-ob`);
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
          utterance.lang = "ko-KR";
          utterance.rate = 0.88; // 어르신을 위해 조금 천천히 또박또박 낭독
          const voices = window.speechSynthesis.getVoices();
          const koVoice = voices.find((v) => v.lang.startsWith("ko"));
          if (koVoice) utterance.voice = koVoice;

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

    try {
      const simpleResponse = await checkAndHandleSimpleQueryAsync(query);
      if (simpleResponse && simpleResponse.isSimple) {
        const reviewed = reviewAndRefineResponse(query, simpleResponse.replyText);

        saveConsultationSession({
          userQuery: query,
          matchedServiceName: "간단 안내 및 교통/기관 정보",
          categoryLabel: "생활안내",
          replyText: reviewed.reviewedText,
          ragResult: reviewed.ragRefinement
        });
        loadHistory();

        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: "bot",
            text: reviewed.reviewedText,
            ragResult: reviewed.ragRefinement
          }
        ]);
        setIsThinking(false);
        return;
      }
    } catch (e) {
      console.warn("Simple query lookup fallback", e);
    }

    setTimeout(() => {
      const rag = searchAndAnalyzePublicData(query);
      const matchedRes = communityResources.find((r) => r.category === rag.matchedPublicData.category) || communityResources[0];
      const draftText = `말씀해주셔서 정말 감사해요. 힘드신 이야기를 편하게 나눠주셔서 고마워요.\n\n공공데이터포털 연계 [${rag.matchedPublicData.serviceName}] 공식 정보를 확인하여 어르신과 주민의 눈높이에 맞춰 알기 쉽게 4단계로 정리해드렸어요.`;

      const reviewed = reviewAndRefineResponse(query, draftText, rag);
      const finalRag = reviewed.ragRefinement || rag;

      saveConsultationSession({
        userQuery: query,
        matchedServiceName: finalRag.matchedPublicData.serviceName,
        categoryLabel: finalRag.matchedPublicData.categoryLabel,
        replyText: reviewed.reviewedText,
        ragResult: finalRag
      });
      loadHistory();

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: "bot",
          text: reviewed.reviewedText,
          ragResult: finalRag,
          matchedResource: matchedRes
        }
      ]);
      setIsThinking(false);
    }, 350);
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
      <main className="w-full h-[100dvh] bg-slate-100 flex flex-col overflow-hidden text-slate-900">
        {/* 상단 딥그린 고선명 헤더 (모바일 가독성 극대화) */}
        <header className="h-14 sm:h-16 px-3 sm:px-6 bg-emerald-900 text-white flex items-center justify-between shadow-md shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base sm:text-xl shadow shrink-0">
              <i className="ri-heart-3-fill"></i>
            </span>
            <div className="min-w-0 truncate">
              <h1 className="font-heading font-black text-sm sm:text-lg flex items-center gap-1.5 leading-tight truncate">
                <span>마을지기 AI</span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-xs font-black bg-emerald-950 text-amber-300 rounded border border-amber-300/40">
                  이웃도우미
                </span>
              </h1>
            </div>
          </div>

          {/* 우측 상단 유틸리티 버튼 (크고 선명하게 3개 중심 배치) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* [🔄 새 대화] 버튼 */}
            <button
              type="button"
              onClick={() => {
                if (confirm("현재 대화를 비우고 '새 대화'를 시작할까요?\n(기존 대화는 '상담기록'에 안전하게 보관되어 있습니다)")) {
                  resetToWelcome();
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs sm:text-sm font-black shadow-md ring-2 ring-emerald-300 transition-all transform active:scale-95 shrink-0"
              title="새 대화 시작"
            >
              <i className="ri-refresh-line text-sm sm:text-base font-black"></i>
              <span className="font-bold">새 대화</span>
            </button>

            {/* [📁 기록] 버튼 */}
            <button
              type="button"
              onClick={() => { loadHistory(); setIsHistoryModalOpen(true); }}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black transition-colors shadow"
              title="저장된 상담 기록"
            >
              <i className="ri-folder-history-fill text-slate-900"></i>
              <span className="hidden xs:inline sm:inline">기록</span>
              <span className="inline-block px-1.5 py-0.2 bg-slate-900 text-white rounded text-[10px] sm:text-xs font-mono">{consultationHistory.length}</span>
            </button>

            {/* [🏠 홈] 집모양 버튼 */}
            <Link
              to="/cases"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-amber-300 hover:text-white transition-all shadow-xs"
              title="홈 (실증 성과 보고서)"
            >
              <i className="ri-home-4-fill text-lg sm:text-xl"></i>
            </Link>

            {/* [🛡️ 관리자] 버튼 */}
            <Link
              to="/admin"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="마을관리자 관제 대시보드"
            >
              <i className="ri-shield-user-line text-lg"></i>
            </Link>
          </div>
        </header>

        {/* 중앙 대화 스트림 영역 (밝고 선명한 큰 글씨 모드) */}
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

                  {/* 공공데이터 4단계 결과 카드 영역 (어르신 눈높이 초대형 카드) */}
                  {m.ragResult && (
                    <div className="mt-4 pt-4 border-t-2 border-slate-200 space-y-3.5">
                      {/* 4단계 음성 안내 배너 */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 border-2 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm">
                        <div className="text-slate-950">
                          <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1 text-amber-950">
                            <i className="ri-sound-module-line"></i> 어르신 맞춤 음성 안내
                          </div>
                          <div className="font-heading font-black text-sm sm:text-base mt-0.5">
                            4단계 안내를 목소리로 들으시겠어요?
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
                          <span>{speakingMsgId === `full-${m.id}` ? "낭독 멈춤" : "4단계 전체 듣기"}</span>
                        </button>
                      </div>

                      {/* 공식 출처 배지 */}
                      {m.ragResult.sources && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <span className="font-extrabold text-slate-900 flex items-center gap-1">
                              <i className="ri-verified-badge-fill text-emerald-600"></i>
                              공식 출처: {m.ragResult.sources.sourceApi || "공공데이터포털"}
                            </span>
                            <span className="text-slate-600 block text-xs mt-0.5">
                              소관: {m.ragResult.sources.department || "정부 및 지자체"}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm px-2.5 py-1 bg-white border border-slate-300 text-emerald-900 rounded-lg font-bold">
                            📞 문의: {m.ragResult.sources.inquiryContact || "129 / 031-590-2114"}
                          </span>
                        </div>
                      )}

                      {/* 4단계 스텝 카드 그리드 (모바일 1열 시원한 큰 글씨) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm sm:text-base">
                        {(m.ragResult.groundedSteps || []).map((st) => (
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
                                  <span>{st.title}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => speakSingleStep(st.stepNum, st.title, st.content)}
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
                              <div className="text-slate-900 whitespace-pre-line leading-relaxed text-sm sm:text-base font-medium">
                                {st.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 안내서 인쇄 & 도움 요청 액션 바 */}
                      <div className="mt-3.5 pt-3 border-t-2 border-slate-200 flex flex-col sm:flex-row gap-2.5">
                        {m.ragResult.matchedPublicData && (
                          <button
                            type="button"
                            onClick={() => openHelpRequest(m.ragResult!.matchedPublicData, m.text)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-md transition-all active:scale-98"
                          >
                            <i className="ri-hand-heart-fill text-lg"></i>
                            <span>이 지원에 도움 요청하기 (마을관리자 연계)</span>
                          </button>
                        )}

                        {m.matchedResource && (
                          <button
                            type="button"
                            onClick={() => setSelectedGuideResource(m.matchedResource!)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs sm:text-sm shadow transition-colors"
                          >
                            <i className="ri-printer-line text-base"></i>
                            <span>A4 안내서 인쇄</span>
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
                <span className="font-bold">공공데이터에서 알기 쉬운 맞춤 정보를 찾고 있어요...</span>
              </div>
            )}
          </div>
        </div>

        {/* 실시간 음성 듣기 상태 바 */}
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

        {/* 빠른 추천 질문 바 (가로 스크롤, 큰 글씨 칩) */}
        <div className="px-3 sm:px-6 py-2.5 bg-emerald-50 border-t-2 border-emerald-200 shrink-0 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs sm:text-sm font-extrabold text-emerald-950 mb-1.5 flex items-center gap-1">
              <i className="ri-flashlight-fill text-amber-500"></i> 자주 찾는 공공 지원 질문:
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar">
              {quickQueries.map((qq) => (
                <button
                  key={qq}
                  onClick={() => handleSendMessage(qq)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100 border-2 border-emerald-300 text-slate-900 font-bold whitespace-nowrap transition-all shadow-xs active:scale-95"
                >
                  {qq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 2단 스마트 입력 영역 (어르신/아이 눈높이 큰 글씨 및 대형 마이크 버튼) */}
        <div className="p-3 sm:p-5 bg-white border-t-2 border-emerald-300 shrink-0 shadow-2xl z-10 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-4xl mx-auto space-y-2.5">
            {/* 1단: 선명한 텍스트 입력창 (높이 50px, 글자 16px) + 상담하기 버튼 */}
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
                  placeholder={isListening ? "🎙️ 말씀하시는 중입니다..." : "질문을 적어주세요 (예: 수술비 지원, 땡큐버스)"}
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

              {/* [상담하기] 전송 버튼 */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-7 py-3 sm:py-3.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-black rounded-2xl transition-all text-sm sm:text-base whitespace-nowrap shadow-md ring-2 ring-emerald-300 shrink-0"
              >
                <i className="ri-send-plane-fill text-base sm:text-lg text-amber-300"></i>
                <span className="font-black">상담하기</span>
              </button>
            </div>

            {/* 2단: 어르신/아이용 [🎙️ 목소리로 말하기] 초대형 54px 풀-너비 버튼 */}
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
              <span className="tracking-tight truncate font-extrabold">
                {isListening ? "말씀 듣는 중... (터치하면 전송됩니다)" : "🎙️ 글씨 쓰기 힘드시면 [여기를 누르고 말씀하세요]"}
              </span>
            </button>

            <p className="text-center text-xs text-slate-600 font-medium leading-tight">
              🔒 개인정보는 일체 저장되지 않습니다. 위급 상황 시 <strong>119 · 112</strong>
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