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
    <div className="space-y-1">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1.5" />;
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className="leading-relaxed">
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-bold text-primary-950">
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
  "독거 어르신 식사 및 일상 돌봄 지원을 받고 싶어요",
  "갑작스러운 실직으로 생계비와 월세가 막막합니다",
  "암 수술을 받았는데 병원비 환급 지원이 있나요?",
  "남양주시 상수도·도시가스 요금 감면 혜택",
  "남양주시 땡큐버스 및 교통약자 드림콜 이용",
  "구리·남양주 관내 초·중·고교 직통 전화번호",
  "취업 준비 중인데 구직촉진수당 신청하고 싶어요"
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

  // 초기 환영 메시지
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
        text: "안녕하세요, 저는 지역사회를 돕는 따뜻한 AI 도우미 **'마을지기'**예요. 😊\n\n병원비, 생계비, 어르신 돌봄, 학교 및 주민센터 전화번호 등 무엇이든 편하게 말씀해주세요.\n이름이나 주민번호 같은 개인정보는 절대 묻지 않으니 안심하세요."
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
      alert("현재 브라우저에서는 음성 마이크가 지원되지 않습니다. 글자로 입력해주세요.");
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
      .replace(/[#*`💡📌📞🛡️🔒📍🚊🚆🚌🚕🚑👮🏛️🏫•]/g, " ")
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
          utterance.rate = 0.9;
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
      const draftText = `오늘 말씀해주셔서 정말 감사해요. 힘드신 이야기를 편하게 나눠주셔서 고마워요.\n\n공공데이터포털 연계 [${rag.matchedPublicData.serviceName}] 공식 원문을 확인하여 어르신과 주민의 눈높이에 맞춰 알기 쉽게 4단계로 정리해드렸어요. (상담 내역이 안전하게 저장되었습니다)`;

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
      <main className="w-full h-[100dvh] bg-background-100 flex flex-col overflow-hidden">
        {/* 상단 통합 헤더 바 */}
        <header className="h-14 sm:h-16 px-3 sm:px-6 bg-primary-800 text-white flex items-center justify-between shadow-md shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent-500 text-foreground-950 flex items-center justify-center font-bold text-base sm:text-lg shadow">
              <i className="ri-heart-3-fill"></i>
            </span>
            <div>
              <h1 className="font-heading font-black text-sm sm:text-lg flex items-center gap-1.5 leading-tight">
                <span>마을지기 AI</span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-primary-950 text-accent-300 rounded border border-accent-300/30">
                  대화형 이웃도우미
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-primary-200 truncate">
                개인정보 없이 · 공공데이터 4단계 맞춤 안내
              </p>
            </div>
          </div>

          {/* 우측 상단 유틸리티 버튼 */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 눈에 잘 띄는 선명한 [새 대화] 버튼 */}
            <button
              type="button"
              onClick={() => {
                if (confirm("현재 대화 내용을 비우고 '새 대화'를 시작할까요?\n(기존 대화는 '상담기록'에 안전하게 보관되어 있습니다)")) {
                  resetToWelcome();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg ring-2 ring-emerald-300/60 transition-all transform active:scale-95 shrink-0"
              title="대화 초기화하고 처음부터 다시 시작하기"
            >
              <i className="ri-refresh-line text-sm sm:text-base font-bold"></i>
              <span className="font-bold tracking-tight">새 대화</span>
            </button>

            <button
              type="button"
              onClick={() => { loadHistory(); setIsHistoryModalOpen(true); }}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-foreground-950 text-xs font-bold transition-colors shadow"
              title="저장된 상담 기록"
            >
              <i className="ri-folder-history-line"></i>
              <span className="hidden xs:inline sm:inline">상담기록</span>
              <span className="inline-block px-1 bg-foreground-950 text-white rounded text-[10px]">{consultationHistory.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsInfoModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white text-base transition-colors"
              title="서비스 소개 및 원칙"
            >
              <i className="ri-information-line"></i>
            </button>

            <Link
              to="/admin"
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white text-base transition-colors"
              title="마을관리자 대시보드"
            >
              <i className="ri-shield-user-line"></i>
            </Link>
          </div>
        </header>

        {/* 중앙 대화 스트림 영역 (Full Height) */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4 bg-background-50">
          <div className="max-w-4xl mx-auto space-y-4 pb-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[95%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-5 shadow-sm text-sm sm:text-base leading-relaxed break-keep ${
                    m.sender === "user"
                      ? "bg-primary-600 text-white rounded-br-none"
                      : "bg-white text-foreground-900 border border-primary-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 overflow-hidden">
                      <FormattedMessageText text={m.text} />
                    </div>
                    {m.sender === "bot" && (
                      <button
                        type="button"
                        onClick={() => speakSimpleMessage(m.id, m.text)}
                        className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                          speakingMsgId === m.id
                            ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                            : "bg-primary-50 hover:bg-primary-100 text-primary-800 border-primary-200"
                        }`}
                        title="소리로 읽어주기"
                      >
                        <i className={speakingMsgId === m.id ? "ri-stop-fill" : "ri-volume-up-line"}></i>
                        <span>{speakingMsgId === m.id ? "멈춤" : "듣기"}</span>
                      </button>
                    )}
                  </div>

                  {/* 공공데이터 4단계 결과 카드 영역 */}
                  {m.ragResult && (
                    <div className="mt-3.5 pt-3.5 border-t border-primary-200 space-y-3">
                      {/* 4단계 음성 안내 배너 */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 border border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                        <div className="text-foreground-950">
                          <div className="text-[11px] font-bold flex items-center gap-1">
                            <i className="ri-sound-module-line"></i> 어르신을 위한 맞춤 음성 안내
                          </div>
                          <div className="font-heading font-bold text-xs sm:text-sm">
                            이 4단계 맞춤 지원 내용을 목소리로 들으시겠어요?
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakAll4Steps(m.id, m.ragResult!)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow transition-all shrink-0 ${
                            speakingMsgId === `full-${m.id}`
                              ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                              : "bg-primary-800 hover:bg-primary-900 text-white"
                          }`}
                        >
                          <i className={speakingMsgId === `full-${m.id}` ? "ri-stop-circle-fill text-sm" : "ri-volume-up-fill text-accent-300 text-sm"}></i>
                          <span>{speakingMsgId === `full-${m.id}` ? "낭독 멈추기" : "4단계 전체 듣기"}</span>
                        </button>
                      </div>

                      {/* 공식 출처 배지 */}
                      {m.ragResult.sources && (
                        <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <span className="font-bold text-primary-900 flex items-center gap-1">
                              <i className="ri-verified-badge-fill text-primary-600"></i>
                              공식 출처: {m.ragResult.sources.sourceApi || "공공데이터포털"}
                            </span>
                            <span className="text-foreground-600 block text-[11px] mt-0.5">
                              소관: {m.ragResult.sources.department || "정부 및 지자체"}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] px-2 py-0.5 bg-white border border-primary-200 text-primary-800 rounded font-semibold whitespace-nowrap self-start sm:self-auto">
                            📞 {m.ragResult.sources.inquiryContact || "129 / 031-590-2114"}
                          </span>
                        </div>
                      )}

                      {/* 4단계 스텝 카드 그리드 (2x2) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                        {(m.ragResult.groundedSteps || []).map((st) => (
                          <div
                            key={st.stepNum}
                            className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all shadow-xs ${
                              speakingStepNum === st.stepNum
                                ? "bg-amber-100/95 border-amber-500 ring-2 ring-amber-400 shadow-md"
                                : st.stepNum === 1
                                ? "bg-emerald-50/90 border-emerald-300"
                                : st.stepNum === 2
                                ? "bg-blue-50/90 border-blue-300"
                                : st.stepNum === 3
                                ? "bg-amber-50/90 border-amber-300 font-medium"
                                : "bg-purple-50/90 border-purple-300"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between font-bold text-foreground-950 mb-1.5">
                                <span className="flex items-center gap-1.5 font-heading text-xs sm:text-sm">
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-black shrink-0 ${
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
                                  className={`p-1 rounded-lg text-xs font-bold transition-colors shadow-xs shrink-0 ${
                                    speakingStepNum === st.stepNum
                                      ? "bg-rose-500 text-white animate-pulse"
                                      : "bg-white hover:bg-gray-100 text-foreground-800 border border-gray-300"
                                  }`}
                                  title={`${st.stepNum}단계만 듣기`}
                                >
                                  <i className={speakingStepNum === st.stepNum ? "ri-stop-fill" : "ri-volume-up-line"}></i>
                                </button>
                              </div>
                              <div className="text-foreground-900 whitespace-pre-line leading-relaxed text-xs">
                                {st.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 안내서 인쇄 & 도움 요청 액션 바 */}
                      <div className="mt-3 pt-2.5 border-t border-primary-200 flex flex-col sm:flex-row gap-2">
                        {m.ragResult.matchedPublicData && (
                          <button
                            type="button"
                            onClick={() => openHelpRequest(m.ragResult!.matchedPublicData, m.text)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent-500 hover:bg-accent-400 text-foreground-950 font-bold rounded-xl text-xs sm:text-sm shadow transition-all active:scale-98"
                          >
                            <i className="ri-hand-heart-fill text-base"></i>
                            <span>이 서비스에 도움 요청하기</span>
                          </button>
                        )}

                        {m.matchedResource && (
                          <button
                            type="button"
                            onClick={() => setSelectedGuideResource(m.matchedResource!)}
                            className="inline-flex items-center justify-center gap-1 px-3.5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow transition-colors"
                          >
                            <i className="ri-printer-line"></i>
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
              <div className="flex items-center gap-2 text-foreground-600 text-xs sm:text-sm p-3 bg-white rounded-2xl border border-primary-100 w-fit shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-ping"></span>
                <span>공공데이터 및 마을지기 지식망에서 맞춤 정보를 찾고 있어요...</span>
              </div>
            )}
          </div>
        </div>

        {/* 실시간 음성 듣기 바 */}
        {isListening && (
          <div className="px-3 sm:px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-between text-xs sm:text-sm font-bold shrink-0 shadow-inner z-10">
            <div className="flex items-center gap-2 truncate">
              <span className="w-3 h-3 rounded-full bg-white animate-ping shrink-0"></span>
              <span className="truncate">🎙️ 귀 기울여 듣고 있어요... 편하게 말씀해주세요!</span>
            </div>
            <button
              type="button"
              onClick={toggleListening}
              className="px-2.5 sm:px-3 py-1 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-lg text-xs shadow transition-all shrink-0 ml-1"
            >
              말씀 끝내기 (전송)
            </button>
          </div>
        )}

        {/* 빠른 추천 질문 바 (가로 스크롤) */}
        <div className="px-3 sm:px-6 py-2 bg-primary-50/80 border-t border-primary-100 shrink-0 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-[11px] font-bold text-primary-800 mb-1 flex items-center gap-1">
              <i className="ri-flashlight-line text-amber-600"></i> 자주 찾는 공공 지원 상황:
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {quickQueries.map((qq) => (
                <button
                  key={qq}
                  onClick={() => handleSendMessage(qq)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-primary-100 border border-primary-200 text-foreground-800 whitespace-nowrap transition-colors text-left text-[11px] sm:text-xs shadow-xs"
                >
                  {qq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 2단 스마트 입력 영역 (시인성 극대화) */}
        <div className="p-3 sm:p-5 bg-white border-t-2 border-primary-100 shrink-0 shadow-2xl z-10">
          <div className="max-w-4xl mx-auto space-y-2.5 pb-1 sm:pb-2">
            {/* 1단: 눈에 확 띄는 고대비 텍스트 입력창 + 상담하기 버튼 */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                {/* 좌측 안내 아이콘 */}
                <span className="absolute left-3.5 text-primary-600 text-lg flex items-center pointer-events-none">
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
                  placeholder={isListening ? "🎙️ 말씀하시는 중입니다..." : "여기에 질문을 적어주세요 (예: 수술비 지원, 땡큐버스, 주민센터)"}
                  className={`w-full pl-10 pr-10 py-3 sm:py-3.5 bg-white border-2 rounded-2xl text-sm sm:text-base font-bold text-foreground-950 placeholder:text-gray-400 focus:outline-none transition-all shadow-md ${
                    isListening
                      ? "border-rose-500 bg-rose-50/70 ring-4 ring-rose-200"
                      : "border-primary-500 hover:border-primary-600 focus:border-primary-700 focus:ring-4 focus:ring-primary-200/80"
                  }`}
                />

                {/* 입력 내용 있을 때 지우기 버튼 */}
                {input.length > 0 && !isListening && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs transition-colors"
                    title="지우기"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                )}
              </div>

              {/* 선명한 [상담하기] 전송 버튼 */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 hover:from-primary-800 hover:to-primary-950 active:scale-95 text-white font-black rounded-2xl transition-all text-sm sm:text-base whitespace-nowrap shadow-lg ring-2 ring-primary-300/70 shrink-0"
              >
                <i className="ri-send-plane-fill text-base sm:text-lg"></i>
                <span className="font-black tracking-tight">상담하기</span>
              </button>
            </div>

            {/* 2단: 어르신용 [🎙️ 목소리로 말하기] 풀-너비 버튼 */}
            <button
              type="button"
              onClick={toggleListening}
              className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 ${
                isListening
                  ? "bg-gradient-to-r from-rose-500 to-red-600 text-white ring-4 ring-rose-300 animate-pulse"
                  : "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 text-foreground-950 ring-1 ring-amber-300"
              }`}
              title={isListening ? "음성 인식 중지" : "마이크로 말하기"}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm ${
                isListening ? "bg-white text-rose-600 animate-bounce" : "bg-white text-orange-600"
              }`}>
                <i className={isListening ? "ri-mic-fill" : "ri-mic-2-fill"}></i>
              </span>
              <span className="tracking-tight">
                {isListening ? "말씀 듣는 중... (터치하면 전송)" : "🎙️ 글씨 쓰기 힘드시면 [목소리로 말하기]를 눌러보세요"}
              </span>
            </button>

            <p className="text-center text-[10px] sm:text-[11px] text-gray-500 leading-tight">
              🔒 개인정보는 일체 저장되지 않습니다. 위급한 응급 상황은 즉시 <strong>119 · 112</strong>로 연락하세요.
            </p>
          </div>
        </div>
      </main>

      {/* 지난 상담 기록 DB 모달 */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-primary-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 bg-primary-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <i className="ri-folder-history-fill text-accent-300 text-xl"></i>
                <h3 className="font-heading font-bold text-base sm:text-lg">지난 상담 및 안내 기록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-gray-50">
              {consultationHistory.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  <i className="ri-inbox-line text-4xl text-gray-300 block mb-2"></i>
                  저장된 상담 기록이 없습니다.
                </div>
              ) : (
                consultationHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadPastConsultation(item)}
                    className="p-3.5 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer flex items-start justify-between gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-100 text-primary-800 border border-primary-200">
                          {item.categoryLabel || "안내"}
                        </span>
                        <span className="text-[11px] text-gray-400">{item.timestamp}</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground-900 truncate group-hover:text-primary-700">
                        {item.userQuery}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
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
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="삭제"
                    >
                      <i className="ri-delete-bin-line text-base"></i>
                    </button>
                  </div>
                ))
              )}
            </div>

            {consultationHistory.length > 0 && (
              <div className="px-5 py-3 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("모든 상담 기록을 삭제하시겠습니까?")) {
                      clearAllConsultationHistory();
                      loadHistory();
                    }
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  기록 전체 비우기
                </button>
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                >
                  닫기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 서비스 소개 및 3대 원칙 모달 */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-primary-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 bg-primary-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <i className="ri-heart-handshake-line text-accent-300 text-xl"></i>
                <h3 className="font-heading font-bold text-base sm:text-lg">마을지기 소개 및 3대 절대 원칙</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInfoModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-sm text-foreground-800 leading-relaxed">
              <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
                <h4 className="font-bold text-primary-950 mb-1">🌿 마을지기의 사명</h4>
                <p className="text-xs sm:text-sm text-foreground-700">
                  마을지기는 복잡한 공공 복지 제도와 지역 생활 정보를 어르신과 취약계층의 눈높이에 맞춰 따뜻한 1:1 대화로 풀어드리는 AI 도우미입니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-foreground-950 mb-2">🛡️ 마을지기 3대 절대 원칙</h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <strong>1. 개인정보 절대 수집 금지</strong>: 이름, 주민번호, 계좌번호 등은 일체 묻지도 보관하지도 않습니다.
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <strong>2. 검증된 공공데이터 기반 안내</strong>: 존재하지 않는 제도를 지어내지 않으며, 공식 출처를 명시합니다.
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <strong>3. 쉬운 우리말 설명</strong>: 전문 행정용어 대신 어르신이 이해하기 편한 일상어로 안내합니다.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                * AI 답변은 주민의 이해를 돕기 위한 참고자료이며, 중요한 신청 및 최종 결정은 주민센터 등 공식 기관과 함께 확인하세요.
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-right shrink-0">
              <button
                type="button"
                onClick={() => setIsInfoModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-primary-800 hover:bg-primary-900 text-white text-xs font-bold shadow"
              >
                확인했습니다
              </button>
            </div>
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