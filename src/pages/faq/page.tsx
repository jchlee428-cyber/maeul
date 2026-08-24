import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../home/components/Footer";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  badge: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "서비스 이용",
    badge: "기본 안내",
    question: "마을지기는 어떤 서비스인가요?",
    answer: "마을지기(Village Keeper)는 지역사회 주민(어르신, 정보취약계층, 일반 주민)이 일상에서 마주하는 복지·생계·의료·교통·행정 문제를 대한민국 공식 공공데이터(data.go.kr)와 지역사회 자원을 연계하여 알기 쉽게 찾아주는 AI 지역사회 생활도우미입니다.",
    tags: ["마을지기", "소개", "생활도우미", "공공데이터"]
  },
  {
    id: "faq-2",
    category: "개인정보 & 비용",
    badge: "100% 무료",
    question: "이용 요금이 발생하나요?",
    answer: "아니요, 마을지기의 모든 상담 및 공공데이터 조회, A4 맞춤 안내서 인쇄, 음성 낭독(TTS) 기능은 주민 누구나 100% 전액 무료로 이용하실 수 있습니다.",
    tags: ["비용", "무료", "요금"]
  },
  {
    id: "faq-3",
    category: "개인정보 & 비용",
    badge: "안심 보안",
    question: "주민등록번호나 개인정보를 입력해야 하나요?",
    answer: "절대 아닙니다! 마을지기는 개인정보 무수집 원칙을 철저히 준수합니다. 주민등록번호, 실명, 상세 계좌번호 등 민감한 개인정보는 일체 묻지도 수집하지도 않습니다. '70대 어르신', '남양주 평내동 거주'처럼 상황만 편하게 말씀하시면 됩니다.",
    tags: ["개인정보", "보안", "주민번호", "안전"]
  },
  {
    id: "faq-4",
    category: "복지 & 의료",
    badge: "복지 RAG",
    question: "갑작스러운 병원비나 월세 체납 시 어떤 도움을 받을 수 있나요?",
    answer: "연간 최대 5,000만 원 한도의 '재난적의료비 지원사업', 1년 초과 병원비를 돌려받는 '본인부담상한제 환급', 위기 가구에 3일 내 지원되는 '긴급복지지원(생계비/주거비)', '에너지바우처(전기·가스요금 감면)' 등의 공공 제도를 4단계 맞춤 행동 요령(준비 서류, 방문처, 신청 절차)으로 꼼꼼히 안내해 드립니다.",
    tags: ["병원비", "수술비", "긴급복지", "월세", "에너지바우처"]
  },
  {
    id: "faq-5",
    category: "지역 자치 & 행정",
    badge: "평내동 & 남양주시청",
    question: "평내동 주민자치센터 강좌나 남양주시청 민원도 검색되나요?",
    answer: "네! 평내동 주민자치센터(pyeongnae.co.kr)의 50여 개 생활체육/문화/IT 강좌와 온라인 수강신청 링크, 그리고 남양주시청(nyj.go.kr)의 여권 발급, 대형폐기물 스티커 인터넷 신고, 통합예약포털, 시청 채용공고 및 대표 전화번호(031-590-2114)를 실시간으로 검색하여 안내해 드립니다.",
    tags: ["평내동", "주민자치센터", "남양주시청", "여권", "대형폐기물"]
  },
  {
    id: "faq-6",
    category: "교통 & 시간표",
    badge: "실시간 연동",
    question: "버스 위치나 지하철 열차시간표도 실시간 조회가 가능한가요?",
    answer: "네, 행정안전부 및 경기도 버스위치정보 OpenAPI를 통해 남양주 땡큐버스, M버스(광역급행), 시내버스(165, 65 등)의 배차시간과 서울교통공사_열차시간표 OpenAPI를 통한 수도권 전철(경춘선, 8호선 별내선, 4호선 진접선, 경의중앙선)의 첫차·막차·배차간격을 실시간으로 조회하실 수 있습니다.",
    tags: ["버스", "지하철", "열차시간표", "땡큐버스", "8호선", "경춘선"]
  },
  {
    id: "faq-7",
    category: "접근성 & 편의",
    badge: "어르신 친화",
    question: "글씨가 작거나 행정 용어가 어려우면 어떻게 하나요?",
    answer: "1) 상단의 '✨ 쉬운말' 버튼을 켜시면 '기초생활수급자' ➔ '정부 지원금을 받는 분', '본인부담상한제' ➔ '병원비 돌려받기 제도'처럼 쉬운 일상어로 자동 풀어서 보여드립니다.\n2) '🎙️ 목소리로 말하기' 버튼으로 말로 질문하고, '🔊 듣기' 버튼으로 답변을 음성으로 들으실 수 있습니다.\n3) 10개국 다국어(영어, 중국어, 베트남어 등) 자동 번역도 지원합니다.",
    tags: ["쉬운말", "음성", "TTS", "STT", "어르신", "다국어"]
  },
  {
    id: "faq-8",
    category: "사람 연결",
    badge: "마을관리자 연계",
    question: "AI 안내를 받은 후 실제 담당 공무원이나 기관에 어떻게 연결하나요?",
    answer: "답변 아래의 '이 서비스에 도움 요청하기' 버튼을 누르시면, 관할 읍·면·동 행정복지센터 맞춤형복지팀 및 마을관리자에게 상담 내용이 안전하게 전달되어 실제 담당자의 유선 상담이나 방문 지원으로 직접 연결됩니다.",
    tags: ["도움요청", "마을관리자", "주민센터", "사람연결"]
  }
];

const CATEGORIES = ["전체", "서비스 이용", "개인정보 & 비용", "복지 & 의료", "지역 자치 & 행정", "교통 & 시간표", "접근성 & 편의", "사람 연결"];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [openIds, setOpenIds] = useState<string[]>(["faq-1", "faq-2"]);
  const navigate = useNavigate();

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === "" ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAskQuickQuery = (queryText: string) => {
    navigate("/", { state: { initialQuery: queryText } });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur border-b border-emerald-800/80 px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🌿</span>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-amber-300">마을지기</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-emerald-200 bg-emerald-900 px-2 py-0.5 rounded-full">
                자주 묻는 질문 (FAQ)
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <span>💬 AI 상담하러 가기</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Title Banner */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs sm:text-sm font-bold mb-3">
            ❓ 주민들이 가장 많이 물어보시는 질문들
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            자주 묻는 질문 (FAQ)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            마을지기 이용 방법, 복지·의료 지원, 평내동 자치센터 강좌, 실시간 교통정보 등에 대해 궁금하신 점을 확인해보세요.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="궁금하신 단어를 검색해보세요 (예: 무료, 병원비, 평내동, 땡큐버스, 개인정보)"
            className="w-full px-4 py-3.5 pl-11 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
          />
          <span className="absolute left-3.5 top-3.5 text-slate-400 text-lg">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white text-sm bg-slate-700 px-2 py-0.5 rounded-full"
            >
              지우기
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30 scale-105"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5 mb-12">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-slate-800/95 border-emerald-500/60 shadow-lg shadow-emerald-950/40"
                      : "bg-slate-800/50 border-slate-700/70 hover:border-slate-600"
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-5 py-4 text-left flex items-start justify-between gap-3 focus:outline-none"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-extrabold text-emerald-400 text-lg sm:text-xl shrink-0 mt-0.5">Q.</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 rounded text-[11px] font-bold">
                            {faq.badge}
                          </span>
                          <span className="text-xs text-slate-400">{faq.category}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`text-slate-400 text-xl shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-400" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-700/50 bg-slate-900/50">
                      <div className="flex items-start gap-3">
                        <span className="font-extrabold text-amber-400 text-lg sm:text-xl shrink-0 mt-0.5">A.</span>
                        <div className="space-y-3 text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                          <p>{faq.answer}</p>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {faq.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-slate-300 font-bold mb-1">검색 결과가 없습니다.</p>
              <p className="text-slate-400 text-sm mb-4">다른 검색어로 찾아보시거나 AI 마을지기에게 직접 물어보세요.</p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
              >
                검색어 초기화
              </button>
            </div>
          )}
        </div>

        {/* Quick CTA Card */}
        <div className="bg-gradient-to-r from-emerald-900/80 to-teal-950/90 border border-emerald-600/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl mb-8">
          <span className="text-3xl block mb-2">💡</span>
          <h2 className="text-lg sm:text-2xl font-black text-white mb-2">
            찾으시는 질문이 없으신가요?
          </h2>
          <p className="text-emerald-200 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
            마을지기 대화창에 편하게 질문하시면, 공공데이터와 최신 AI가 실시간으로 가장 정확한 답변을 찾아드립니다.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleAskQuickQuery("우리 동네에서 제가 받을 수 있는 도움을 찾아주세요.")}
              className="px-3.5 py-2 bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition-all"
            >
              "우리 동네 도움 찾기"
            </button>
            <button
              onClick={() => handleAskQuickQuery("평내동 주민자치센터 강좌 알려줘")}
              className="px-3.5 py-2 bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition-all"
            >
              "평내 자치센터 강좌"
            </button>
            <button
              onClick={() => handleAskQuickQuery("남양주시청 대형폐기물 스티커 신청")}
              className="px-3.5 py-2 bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition-all"
            >
              "시청 대형폐기물 신청"
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
