import { useState, useEffect, useRef } from "react";
import { communityResources, type CommunityResource } from "@/data/communityResources";
import { searchAndAnalyzePublicData, type RAGAnalysisResult, type PublicDataRecord } from "@/services/publicDataService";
import { checkAndHandleSimpleQuery, checkAndHandleSimpleQueryAsync } from "@/services/simpleQueryService";
import {
  saveConsultationSession,
  getConsultationHistory,
  clearAllConsultationHistory,
  deleteConsultationSession,
  type ConsultationRecord
} from "@/services/consultationHistoryService";
import CustomGuideSheet from "./CustomGuideSheet";
import HelpRequestModal from "./HelpRequestModal";
import type { CommunityCase } from "@/services/caseManagementService";

// Web Speech API 타입 선언
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

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  ragResult?: RAGAnalysisResult;
  matchedResource?: CommunityResource;
}

// 텍스트 마크다운 포맷 렌더러 (굵은 글씨 및 하이라이트)
function FormattedMessageText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-2" />;
        // **굵은 글씨** 파싱
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
  "남양주시 상수도·도시가스 요금 및 취약계층 감면 혜택",
  "남양주시 버스·택시 요금 및 교통약자 이동지원(드림콜)",
  "독거 어르신 식사 및 일상 돌봄 지원을 받고 싶어요",
  "갑작스러운 실직으로 생계비와 월세가 막막합니다",
  "암 수술을 받았는데 병원비가 너무 많이 나왔어요",
  "취업 준비 중인데 구직 수당과 교육 지원이 필요해요",
  "겨울철 난방비와 전기요금 지원 바우처가 있나요?"
];

export default function ChatModal({
  isOpen,
  onClose,
  initialQuery = "",
  initialCategory = "",
}: ChatModalProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedGuideResource, setSelectedGuideResource] = useState<CommunityResource | null>(null);
  
  // 음성인식 (STT) 상태
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // 음성출력 (TTS) 상태
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speakingStepNum, setSpeakingStepNum] = useState<number | null>(null);

  // 도움 요청 모달 상태
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [targetPublicData, setTargetPublicData] = useState<PublicDataRecord | null>(null);
  const [currentQueryContext, setCurrentQueryContext] = useState("");

  // 상담 기록 DB 모달 상태
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState<ConsultationRecord[]>([]);

  // 상담 기록 DB 동기화
  const loadHistory = () => {
    setConsultationHistory(getConsultationHistory());
  };

  // 음성인식 인스턴스 초기화
  useEffect(() => {
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

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from({ length: 1 }, (_, i) => event.results[i][0].transcript).join("");
        setInput(transcript);
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // 모바일 음성 엔진 워밍업
      if ("speechSynthesis" in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      if (initialQuery || initialCategory) {
        const queryText = initialQuery || `${initialCategory} 분야 지원 제도와 공공데이터를 안내해주세요`;
        handleSendMessage(queryText);
      } else if (messages.length === 0) {
        resetToWelcome();
      }
    }
  }, [isOpen, initialQuery, initialCategory]);

  if (!isOpen) return null;

  // 상담 내용 초기화 (새로운 상담 시작)
  const resetToWelcome = () => {
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
        text: "안녕하세요, 저는 마을지기예요. 오늘 저를 찾아주셔서 정말 반가워요.\n\n글씨로 적으셔도 좋고, 아래 눈에 띄는 노란색 [🎙️ 목소리로 말하기] 버튼을 눌러 편하게 말씀하셔도 괜찮아요.\n이름이나 주민번호 같은 개인정보는 묻지 않으니 안심하세요."
      }
    ]);
  };

  const handleResetChat = () => {
    if (messages.length > 1) {
      if (confirm("현재 진행 중인 상담 내용을 초기화하고 새로운 상담을 시작할까요?\n(기존 상담 내용은 '지난 상담 기록'에 안전하게 저장되어 있습니다)")) {
        resetToWelcome();
      }
    } else {
      resetToWelcome();
    }
  };

  // 과거 상담 기록에서 특정 상담 불러오기
  const handleLoadPastConsultation = (rec: ConsultationRecord) => {
    // 1. 단순 질의 기록인 경우
    if (!rec.ragResult) {
      const restoredText =
        rec.replyText ||
        checkAndHandleSimpleQuery(rec.userQuery)?.replyText ||
        `"${rec.userQuery}"에 대한 안내 내용입니다.`;

      setMessages([
        {
          id: `past-user-${rec.id}`,
          sender: "user",
          text: rec.userQuery
        },
        {
          id: `past-bot-${rec.id}`,
          sender: "bot",
          text: `[📁 불러온 안내 기록: ${rec.timestamp}]\n\n${restoredText}`
        }
      ]);
      setIsHistoryModalOpen(false);
      return;
    }

    // 2. 10단계 복합 상담 기록인 경우
    const matchedRes =
      communityResources.find((r) => r.category === rec.ragResult!.matchedPublicData.category) ||
      communityResources[0];

    const restoredBotHeader =
      rec.replyText ||
      `오늘 말씀해주셔서 정말 감사해요. 힘드신 이야기를 편하게 나눠주셔서 고마워요.\n\n공공데이터포털 연계 [${rec.matchedServiceName}] 공식 원문을 확인하여 어르신과 주민의 눈높이에 맞춰 10단계로 정리해드렸어요.`;

    setMessages([
      {
        id: `past-user-${rec.id}`,
        sender: "user",
        text: rec.userQuery
      },
      {
        id: `past-bot-${rec.id}`,
        sender: "bot",
        text: `[📁 불러온 상담 기록: ${rec.timestamp}]\n\n${restoredBotHeader}`,
        ragResult: rec.ragResult,
        matchedResource: matchedRes
      }
    ]);
    setIsHistoryModalOpen(false);
  };

  // 전체 상담 기록 비우기
  const handleClearAllHistory = () => {
    if (confirm("저장된 모든 지난 상담 기록을 완전히 삭제하시겠습니까? (삭제 후 복구 불가)")) {
      clearAllConsultationHistory();
      loadHistory();
    }
  };

  // 개별 상담 기록 삭제
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConsultationSession(id);
    loadHistory();
  };

  // 음성인식 시작/중지 토글
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("현재 사용 중이신 브라우저에서는 마이크 음성 인식이 지원되지 않습니다. 글자로 입력해주세요.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start failed", err);
      }
    }
  };

  // [모바일 완벽 호환 TTS 재생 엔진]
  const playMobileTTS = (text: string, onStartCallback: () => void, onEndCallback: () => void) => {
    if (!("speechSynthesis" in window)) {
      alert("음성 듣기 기능이 지원되지 않는 브라우저입니다.");
      return;
    }

    // 1. 모바일 브라우저 일시정지 상태 강제 해제 (Audio Resume)
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    // 2. 특수기호 및 마크다운 정제
    const cleanText = text
      .replace(/[#*`💡📌📞🛡️🔒📍🚊🚆🚌🚕🚑👮]/g, " ")
      .replace(/➔/g, "에서 ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    // 모바일 지연 호출 (cancel 버그 방지)
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = "ko-KR";
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // 3. 한국어 지원 음성 엔진 명시적 바인딩 (모바일 필수)
        const voices = window.speechSynthesis.getVoices();
        const koreanVoice = voices.find(
          (v) => v.lang === "ko-KR" || v.lang === "ko_KR" || v.lang.startsWith("ko")
        );
        if (koreanVoice) {
          utterance.voice = koreanVoice;
        }

        utterance.onstart = () => {
          onStartCallback();
        };

        utterance.onend = () => {
          (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = undefined;
          onEndCallback();
        };

        utterance.onerror = (e) => {
          console.warn("TTS playback error:", e);
          (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = undefined;
          onEndCallback();
        };

        // 4. [중요] 모바일 가비지 컬렉터(GC) 조기 파괴 방지 (전역 참조 유지)
        (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = utterance;

        window.speechSynthesis.speak(utterance);

        // 안드로이드 크롬 크래시 방지용 주기적 resume 핑
        const resumeInterval = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(resumeInterval);
          } else {
            window.speechSynthesis.resume();
          }
        }, 5000);
      } catch (err) {
        console.error("SpeechSynthesis execution failed:", err);
        onEndCallback();
      }
    }, 50);
  };

  // 10단계 전체를 상세하게 읽어주기 (TTS)
  const speakAll10Steps = (msgId: string, rag: RAGAnalysisResult) => {
    if (speakingMsgId === `full-${msgId}`) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      setSpeakingStepNum(null);
      return;
    }

    const narrative = [
      `안녕하세요, 마을지기예요. 주민님께서 겪고 계신 상황에 대해 공공데이터 10단계 지원 계획을 차근차근 읽어드릴게요.`,
      `첫 번째, 주민 문제 의도 분석입니다. ${rag.groundedSteps[0].content}`,
      `두 번째, 공공데이터 원문 확인입니다. ${rag.groundedSteps[1].content}`,
      `세 번째, 지원 분야와 법적 근거는, ${rag.groundedSteps[2].content}입니다.`,
      `네 번째, 가장 중요한 공식 지원 내용입니다. ${rag.groundedSteps[3].content}`,
      `다섯 번째, 신청 자격과 소득 기준은, ${rag.groundedSteps[4].content}`,
      `여섯 번째, 쉬운 말 풀이입니다. ${rag.groundedSteps[5].content}`,
      `일곱 번째, 주민님이 실제로 하셔야 할 행동 순서입니다. ${rag.groundedSteps[6].content}`,
      `여덟 번째, 챙기셔야 할 준비 서류입니다. ${rag.groundedSteps[7].content}`,
      `아홉 번째, 공식 기관 확인 사항입니다. ${rag.groundedSteps[8].content}`,
      `열 번째, 사람 연결 안내입니다. 혼자 신청하기 어려우시면 아래 주황색 도움 요청하기 버튼을 눌러주세요. 마을관리자가 직접 기관에 연결해드립니다.`
    ].join(". ");

    playMobileTTS(
      narrative,
      () => setSpeakingMsgId(`full-${msgId}`),
      () => {
        setSpeakingMsgId(null);
        setSpeakingStepNum(null);
      }
    );
  };

  // 특정 개별 단계만 읽어주기 (TTS)
  const speakSingleStep = (stepNum: number, title: string, content: string) => {
    if (speakingStepNum === stepNum) {
      window.speechSynthesis.cancel();
      setSpeakingStepNum(null);
      setSpeakingMsgId(null);
      return;
    }

    const text = `${stepNum}단계, ${title} 내용입니다. ${content}`;
    playMobileTTS(
      text,
      () => {
        setSpeakingStepNum(stepNum);
        setSpeakingMsgId(`step-${stepNum}`);
      },
      () => setSpeakingStepNum(null)
    );
  };

  // 요약 문구 및 단순 챗봇 답변 읽기 (TTS)
  const speakSimpleMessage = (msgId: string, textToSpeak: string) => {
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
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
      // 1. 단순 질의(지하철 도착정보, 전화번호 문의, 기관 위치, 일상 인사 등) 비동기 감지
      const simpleResponse = await checkAndHandleSimpleQueryAsync(query);

      if (simpleResponse && simpleResponse.isSimple) {
        saveConsultationSession({
          userQuery: query,
          matchedServiceName: "간단 안내 및 교통/기관 정보",
          categoryLabel: "생활안내",
          replyText: simpleResponse.replyText
        });
        loadHistory();

        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: "bot",
            text: simpleResponse.replyText
          }
        ]);

        setIsThinking(false);
        return;
      }
    } catch (e) {
      console.warn("Simple query async lookup fallback", e);
    }

    // 2. 복합 지원 상담 (공공데이터 RAG 기반 10단계 실행)
    setTimeout(() => {
      const rag = searchAndAnalyzePublicData(query);
      const matchedRes = communityResources.find((r) => r.category === rag.matchedPublicData.category) || communityResources[0];
      const botResponseText = `오늘 말씀해주셔서 정말 감사해요. 힘드신 이야기를 편하게 나눠주셔서 고마워요.\n\n공공데이터포털 연계 [${rag.matchedPublicData.serviceName}] 공식 원문을 확인하여 어르신과 주민의 눈높이에 맞춰 10단계로 정리해드렸어요. (상담 내역이 안전하게 저장되었습니다)`;

      // 상담 DB에 자동 저장 (Auto-Save to DB)
      saveConsultationSession({
        userQuery: query,
        matchedServiceName: rag.matchedPublicData.serviceName,
        categoryLabel: rag.matchedPublicData.categoryLabel,
        replyText: botResponseText,
        ragResult: rag
      });
      loadHistory();

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: "bot",
          text: botResponseText,
          ragResult: rag,
          matchedResource: matchedRes
        }
      ]);

      setIsThinking(false);
    }, 400);
  };

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // [모바일 최적화] 상담 시작 시 공간을 많이 차지하는 첫 환영 메시지를 제거하여 실제 상담 답변이 상단에 시원하게 보이도록 처리
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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm">
        <div className="relative w-full h-[100dvh] sm:h-[90vh] max-w-4xl bg-white rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-primary-200 overflow-hidden flex flex-col">
          {/* 상단 바 (모바일 반응형 최적화) */}
          <div className="flex items-center justify-between px-2.5 sm:px-5 py-2 sm:py-3 bg-primary-800 text-white shrink-0 shadow-md">
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <span className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-full bg-accent-500 text-foreground-950 flex items-center justify-center font-bold text-sm sm:text-lg shadow">
                <i className="ri-heart-3-fill"></i>
              </span>
              <div className="min-w-0">
                <h2 className="font-heading font-bold text-xs sm:text-base flex items-center gap-1">
                  <span className="truncate">마을지기 AI</span>
                  <span className="px-1 py-0.2 text-[8px] sm:text-[9px] font-bold bg-primary-900 text-accent-300 rounded border border-accent-300/30 shrink-0">
                    음성/글자
                  </span>
                </h2>
                <p className="text-[10px] sm:text-xs text-primary-200 truncate">
                  개인정보 없이 · 공공데이터 기반
                </p>
              </div>
            </div>

            {/* 우측 상단 도구: 초기화 & 지난 기록 & 닫기 */}
            <div className="flex items-center gap-1 shrink-0">
              {/* 대화 내용 초기화 버튼 */}
              <button
                type="button"
                onClick={handleResetChat}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-xs font-semibold transition-colors"
                title="상담 내용 초기화 (새 대화 시작)"
              >
                <i className="ri-refresh-line"></i>
                <span className="hidden sm:inline">초기화</span>
              </button>

              {/* 지난 상담 기록 모달 열기 버튼 */}
              <button
                type="button"
                onClick={() => {
                  loadHistory();
                  setIsHistoryModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-400 text-foreground-950 text-[11px] sm:text-xs font-bold transition-colors shadow"
                title="저장된 상담 DB 목록"
              >
                <i className="ri-folder-history-line"></i>
                <span className="hidden xs:inline sm:inline">상담기록</span>
                <span className="inline-block px-1 bg-foreground-900 text-white rounded text-[10px]">{consultationHistory.length}</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors ml-0.5"
                aria-label="닫기"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>

          {/* 대화 영역 */}
          {/* 대화 영역 */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-background-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[95%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-5 shadow-sm text-sm sm:text-base leading-relaxed break-keep ${
                    m.sender === "user"
                      ? "bg-primary-600 text-white rounded-br-none"
                      : "bg-white text-foreground-900 border border-primary-200 rounded-bl-none"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 overflow-hidden">
                      <FormattedMessageText text={m.text} />
                    </div>
                    {/* 단순 챗봇 답변 듣기 버튼 */}
                    {m.sender === "bot" && (
                      <button
                        type="button"
                        onClick={() => speakSimpleMessage(m.id, m.text)}
                        className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                          speakingMsgId === m.id
                            ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                            : "bg-primary-50 hover:bg-primary-100 text-primary-800 border-primary-200"
                        }`}
                        title="소리로 읽어주기"
                      >
                        <i className={speakingMsgId === m.id ? "ri-stop-fill" : "ri-volume-up-line"}></i>
                        <span className="text-[10px]">듣기</span>
                      </button>
                    )}
                  </div>

                  {/* RAG 공공데이터 10단계 결과 영역 */}
                  {m.ragResult && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-primary-200 space-y-3">
                      {/* 10단계 상세 음성 설명 전용 배너 */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 border border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                        <div className="text-foreground-950">
                          <div className="text-[11px] font-bold flex items-center gap-1">
                            <i className="ri-sound-module-line"></i> 어르신을 위한 맞춤 음성 안내
                          </div>
                          <div className="font-heading font-bold text-xs sm:text-sm">
                            10단계 내용을 목소리로 들으시겠어요?
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakAll10Steps(m.id, m.ragResult!)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow transition-all shrink-0 ${
                            speakingMsgId === `full-${m.id}`
                              ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                              : "bg-primary-800 hover:bg-primary-900 text-white"
                          }`}
                        >
                          <i className={speakingMsgId === `full-${m.id}` ? "ri-stop-circle-fill text-sm" : "ri-volume-up-fill text-accent-300 text-sm"}></i>
                          <span>{speakingMsgId === `full-${m.id}` ? "낭독 멈추기" : "10단계 전체 듣기"}</span>
                        </button>
                      </div>

                      {/* 공식 출처 배지 */}
                      <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div>
                          <span className="font-bold text-primary-900 flex items-center gap-1">
                            <i className="ri-verified-badge-fill text-primary-600"></i>
                            공식 출처: {m.ragResult.sources.sourceApi}
                          </span>
                          <span className="text-foreground-600 block text-[11px] mt-0.5">
                            소관: {m.ragResult.sources.department}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] px-2 py-0.5 bg-white border border-primary-200 text-primary-800 rounded font-semibold whitespace-nowrap self-start sm:self-auto">
                          📞 {m.ragResult.sources.inquiryContact}
                        </span>
                      </div>

                      {/* 10단계 스텝 카드 리스트 */}
                      <div className="space-y-2">
                        {m.ragResult.groundedSteps.map((step) => {
                          const isCurrentlyPlaying = speakingStepNum === step.stepNum;
                          return (
                            <div
                              key={step.stepNum}
                              className={`p-3 rounded-xl border transition-all ${
                                isCurrentlyPlaying
                                  ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 shadow-sm"
                                  : "bg-primary-50/40 border-primary-100 hover:bg-primary-50/80"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-primary-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                    {step.stepNum}
                                  </span>
                                  <h4 className="font-bold text-xs sm:text-sm text-primary-950">
                                    {step.title}
                                  </h4>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => speakSingleStep(step.stepNum, step.title, step.content)}
                                  className={`p-1 rounded text-xs font-bold transition-colors shrink-0 ${
                                    isCurrentlyPlaying
                                      ? "bg-rose-500 text-white animate-pulse"
                                      : "bg-white text-primary-800 hover:bg-primary-100 border border-primary-200 shadow-xs"
                                  }`}
                                  title="이 단계만 소리로 듣기"
                                >
                                  <i className={isCurrentlyPlaying ? "ri-stop-fill" : "ri-volume-up-line"}></i>
                                </button>
                              </div>

                              <p className="mt-1 text-xs sm:text-sm text-foreground-800 pl-6.5 leading-snug">
                                {step.content}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* 안내서 인쇄 & 도움 요청 액션 버튼 */}
                      <div className="mt-3 pt-2.5 border-t border-primary-200 flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => openHelpRequest(m.ragResult!.matchedPublicData, m.text)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent-500 hover:bg-accent-400 text-foreground-950 font-bold rounded-xl text-xs sm:text-sm shadow transition-all active:scale-98"
                        >
                          <i className="ri-hand-heart-fill text-base"></i>
                          <span>이 서비스에 도움 요청하기</span>
                        </button>

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
              <div className="flex items-center gap-2 text-foreground-600 text-xs sm:text-sm p-3 bg-white rounded-2xl border border-primary-100 w-fit">
                <span className="w-2 h-2 rounded-full bg-primary-600 animate-ping"></span>
                <span>공공데이터 및 마을지기 지식망에서 신속히 찾고 있어요...</span>
              </div>
            )}
          </div>

          {/* 실시간 음성 듣기 상태 표시 바 */}
          {isListening && (
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-between text-xs sm:text-sm font-bold shrink-0 shadow-inner">
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

          {/* 빠른 질문 제안 영역 (모바일 가로 스크롤) */}
          <div className="px-3 sm:px-4 py-2 bg-primary-50/70 border-t border-primary-100 shrink-0">
            <div className="text-[11px] font-bold text-primary-800 mb-1 flex items-center gap-1">
              <i className="ri-flashlight-line text-amber-600"></i> 자주 찾는 공공 지원 상황:
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {quickQueries.map((qq) => (
                <button
                  key={qq}
                  onClick={() => handleSendMessage(qq)}
                  className="px-2.5 sm:px-3 py-1 rounded-full bg-white hover:bg-primary-100 border border-primary-200 text-foreground-800 whitespace-nowrap transition-colors text-left text-[11px] sm:text-xs shadow-xs"
                >
                  {qq}
                </button>
              ))}
            </div>
          </div>

          {/* 하단 입력 영역: 안드로이드 및 모바일 최적화 (2단 스마트 구조) */}
          <div className="p-2.5 sm:p-4 bg-white border-t border-gray-200 shrink-0 space-y-2 pb-3 sm:pb-4 shadow-lg">
            {/* 1단: 텍스트 입력창 + 선명한 [상담하기] 버튼 */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    handleSendMessage();
                  }
                }}
                placeholder={isListening ? "🎙️ 말씀하시는 중..." : "주민센터, 버스, 지원금 등 질문하기"}
                className={`flex-1 min-w-0 px-3.5 sm:px-4 py-2.5 sm:py-3 border rounded-xl text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors shadow-inner ${
                  isListening ? "border-rose-400 bg-rose-50/50" : "border-gray-300 bg-gray-50/70 focus:bg-white"
                }`}
              />

              {/* [상담하기] 전송 버튼 (모바일에서도 항상 선명하게 노출) */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="inline-flex items-center justify-center gap-1 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold rounded-xl transition-all text-xs sm:text-sm whitespace-nowrap shadow-md shrink-0 active:scale-95"
              >
                <i className="ri-send-plane-fill text-sm"></i>
                <span className="font-bold">상담하기</span>
              </button>
            </div>

            {/* 2단: 어르신용 큼직한 [🎙️ 목소리로 말하기 (음성 상담)] 풀-너비 버튼 */}
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
      </div>

      {/* 지난 상담 기록 DB 모달 */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-primary-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-primary-800 text-white">
              <div className="flex items-center gap-2">
                <i className="ri-folder-history-fill text-xl text-accent-300"></i>
                <h3 className="font-heading font-bold text-lg">지난 상담 기록 DB</h3>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-gray-50">
              {consultationHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  저장된 지난 상담 기록이 없습니다.
                </div>
              ) : (
                consultationHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadPastConsultation(item)}
                    className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-primary-500 hover:shadow-md cursor-pointer transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span className="px-2 py-0.5 rounded bg-primary-100 text-primary-800 font-bold text-[10px]">
                          {item.categoryLabel}
                        </span>
                        <span>{item.timestamp}</span>
                      </div>
                      <div className="font-bold text-foreground-900 text-sm">
                        "{item.userQuery}"
                      </div>
                      <div className="text-xs text-primary-700 font-medium mt-1">
                        추천: {item.matchedServiceName}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-primary-600 font-semibold group-hover:underline hidden sm:inline">
                        불러오기 ➔
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                        className="p-1 text-gray-400 hover:text-rose-500 rounded"
                        title="기록 삭제"
                      >
                        <i className="ri-delete-bin-line text-base"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-3 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleClearAllHistory}
                className="text-rose-600 hover:underline font-semibold"
              >
                전체 상담 기록 비우기
              </button>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              >
                닫기
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
        onSuccess={(newCase: CommunityCase) => {
          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              sender: "bot",
              text: `✅ [도움 요청 접수 완료]\n사례번호: ${newCase.id}\n\n요청하신 사항이 마을관리자 대시보드에 안전하게 접수되었어요. 마을관리자가 내용을 확인한 후 관할 주민센터 복지팀을 통해 신속히 연락드릴게요.`
            }
          ]);
        }}
      />

      {/* A4 맞춤 안내서 모달 */}
      {selectedGuideResource && (
        <CustomGuideSheet
          resource={selectedGuideResource}
          onClose={() => setSelectedGuideResource(null)}
        />
      )}
    </>
  );
}
