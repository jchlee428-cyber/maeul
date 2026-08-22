import { useState } from "react";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import { convertToEasyKorean, SUPPORTED_LANGUAGES, translateTextToTargetLang } from "@/services/multilingualEngine";

const SAMPLE_DOCS = [
  {
    title: "2026년 남양주시 긴급복지 및 어르신 생활안정 지원 공고문",
    content: `[남양주시 공고 제2026-482호] 
2026년도 상반기 저소득 취약계층 및 독거어르신 긴급생활안정자금 지원계획 공고
1. 사업목적: 경제적 위기상황에 직면한 관내 주민등록상 거주지 관할 가구의 생계안정 도모
2. 지원대상: 기준중위소득 75% 이하 및 금융재산 600만원 이하인 기초생활보장 수급권자 및 차상위계층
3. 지원내용: 1인가구 기준 월 713,100원 생계비 3개월간 한시 지원 및 동절기 난방 연료비 추가 차감
4. 신청기한: 2026. 04. 30.(목) 18:00까지
5. 구비서류: 신분증, 통장사본, 금융정보제공동의서, 임대차계약서(해당자)
6. 신청장소: 수동면 종합행정복지센터 맞춤형복지팀 (방문접수)
7. 문의처: 남양주시 복지정책과 (031-590-2601)`
  },
  {
    title: "외국인 계절근로자 및 다문화가정 의료지원 바우처 안내",
    content: `[남양주시 보건소 안내]
외국인 주민 및 농촌 계절근로자 무료 건강검진 및 독감 예방접종 지원 안내
1. 대상: 남양주시 관내 사업장 및 농가에 등록된 외국인 등록증 소지자
2. 내용: 흉부 X-ray, 혈액검사, 혈압/당뇨 기본 검진 및 인플루엔자 무료 예방접종
3. 일시: 2026년 4월 매주 수요일 오전 09:00 ~ 12:00
4. 장소: 남양주시 풍양보건소 및 수동보건지소
5. 지참물: 외국인등록증(또는 여권)
6. 문의: 남양주시 보건행정과 (031-590-8000)`
  }
];

export default function EasyDocsPage() {
  const [inputText, setInputText] = useState(SAMPLE_DOCS[0].content);
  const [selectedLang, setSelectedLang] = useState("ko");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string[];
    terms: { term: string; explanation: string }[];
    dates: string;
    target: string;
    documents: string[];
    whereToApply: string;
    contact: string;
  } | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        summary: [
          "갑작스러운 어려움에 처한 주민에게 3개월간 월 71만 원의 긴급 생계비를 지원합니다.",
          "어려운 이웃뿐 아니라 독거 어르신도 난방비와 함께 지원받을 수 있습니다.",
          "수동면 종합행정복지센터 복지팀에 신분증과 통장을 가지고 방문하시면 됩니다."
        ],
        terms: [
          { term: "기준중위소득 75%", explanation: "대한민국 전체 가구를 소득 순서대로 줄 세웠을 때 75% 수준 이하인 기준입니다." },
          { term: "기초생활보장 수급권자", explanation: "소득이나 재산이 적어 국가에서 생계비나 의료비를 매달 보조받는 자격입니다." },
          { term: "차상위계층", explanation: "기초수급자 바로 윗 단계로, 형편이 어렵지만 일부 감면 혜택을 받는 분들입니다." }
        ],
        dates: "2026년 4월 30일(목) 오후 6시까지 (마감 전 신청 필요)",
        target: "남양주시에 거주하는 기초수급자, 차상위계층 및 위기 독거어르신 가구",
        documents: ["신분증 (주민등록증 또는 운전면허증)", "통장 사본 (본인 명의)", "금융정보제공동의서 (주민센터 구비)", "월세 계약서 (해당자)"],
        whereToApply: "수동면 종합행정복지센터 맞춤형복지팀 (방문 접수)",
        contact: "수동면 복지팀 (031-590-2601) / 보건복지상담센터 (129)"
      });
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-5xl mx-auto w-full">
        {/* 상단 타이틀 */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="px-3.5 py-1 text-xs font-black rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            EASY ADMINISTRATIVE DOCUMENTS
          </span>
          <h1 className="font-heading text-2xl md:text-4xl font-black text-slate-950 mt-2">
            📄 행정문서 쉽게 보기
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            이해하기 어려운 주민센터 공문서나 안내문을 복사해 넣으시면, AI가 <strong>어려운 행정용어를 쉬운 말로 풀고 핵심만 요약</strong>해드립니다.
          </p>
        </div>

        {/* 샘플 공문서 선택 버튼 */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs font-bold text-slate-500">샘플 공문 선택:</span>
          {SAMPLE_DOCS.map((doc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(doc.content);
                setAnalysisResult(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-all shadow-xs"
            >
              📋 {doc.title.slice(0, 24)}...
            </button>
          ))}
        </div>

        {/* 문서 입력창 카드 */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-black text-sm text-slate-900 flex items-center gap-1.5">
              <i className="ri-file-text-fill text-emerald-700"></i>
              행정 공문서 텍스트 입력
            </label>
            <button
              type="button"
              onClick={() => setInputText("")}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              내용 지우기
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={7}
            placeholder="공문서나 주민센터 안내문 내용을 여기에 붙여넣으세요..."
            className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* 번역 언어 선택 */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-600 whitespace-nowrap">결과 번역 언어:</label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  AI가 공문서를 알기 쉽게 분석 중...
                </>
              ) : (
                <>
                  <i className="ri-magic-line text-lg"></i>
                  <span>AI로 쉽게 풀어서 해설하기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI 해설 결과 영역 (7단계 분석 구조) */}
        {analysisResult && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-emerald-300 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-slate-200">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  AI 해설 완료
                </span>
                <h2 className="font-heading text-xl md:text-2xl font-black text-slate-950 mt-1">
                  ✨ 알기 쉬운 행정문서 요약 보고서
                </h2>
              </div>
              {selectedLang !== "ko" && (
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                  🌐 {SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.nativeName} 번역 적용됨
                </span>
              )}
            </div>

            {/* 1. 핵심 3줄 요약 */}
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300">
              <h3 className="font-black text-sm text-emerald-950 flex items-center gap-1.5 mb-2">
                <i className="ri-checkbox-circle-fill text-emerald-600 text-base"></i>
                1. 한눈에 보는 핵심 요약
              </h3>
              <ul className="space-y-1.5 text-xs md:text-sm text-emerald-950 font-bold">
                {analysisResult.summary.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700">✔</span>
                    <span>{selectedLang === "ko" ? s : translateTextToTargetLang(s, selectedLang)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. 어려운 행정용어 쉬운말 사전 */}
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300">
              <h3 className="font-black text-sm text-amber-950 flex items-center gap-1.5 mb-2">
                <i className="ri-book-open-fill text-amber-600 text-base"></i>
                2. 어려운 행정용어 쉬운말 풀이
              </h3>
              <div className="space-y-2">
                {analysisResult.terms.map((t, idx) => (
                  <div key={idx} className="text-xs md:text-sm bg-white p-3 rounded-xl border border-amber-200">
                    <strong className="text-amber-900 font-extrabold">{t.term}</strong>
                    <span className="mx-1 text-slate-400">➔</span>
                    <span className="text-slate-900 font-bold">{t.explanation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 5대 핵심 실천 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-900 block mb-1">📅 중요 날짜 / 신청 기한:</strong>
                <span className="text-rose-700 font-bold">{analysisResult.dates}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-900 block mb-1">👤 지원 대상자:</strong>
                <span className="text-slate-800 font-bold">{analysisResult.target}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-900 block mb-1">📝 준비할 서류 목록:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-800 font-bold">
                  {analysisResult.documents.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-900 block mb-1">🏛️ 신청 장소 및 문의처:</strong>
                <p className="text-slate-800 font-bold">{analysisResult.whereToApply}</p>
                <p className="text-emerald-700 font-bold mt-1">📞 {analysisResult.contact}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
