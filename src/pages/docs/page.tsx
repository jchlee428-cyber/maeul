import { useState } from "react";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import {
  SUPPORTED_LANGUAGES,
  MULTILINGUAL_DOC_ANALYSIS,
  type AdminDocReport
} from "@/services/multilingualEngine";

const SAMPLE_DOCS = [
  {
    key: "emergency",
    title: "2026년 남양주시 긴급복지 및 어르신 생활안정 지원 공고문",
    content: `[남양주시 공고 제2026-482호] 
2026년도 상반기 저소득 취약계층 및 독거어르신 긴급생활안정자금 지원계획 공고
1. 사업목적: 경제적 위기상황에 직면한 관내 주민등록상 거주지 관할 가구의 생계안정 도모
2. 지원대상: 기준중위소득 75% 이하 및 금융재산 600만원 이하인 기초생활보장 수급권자 및 차상위계층
3. 지원내용: 1인가구 기준 월 713,100원 생계비 3개월간 한시 지원 및 동절기 난방 연료비 추가 차감
4. 신청기한: 2026. 04. 30.(목) 18:00까지
5. 구비서류: 신분증, 통장사본, 금융정보제공동의서, 임대차계약서(해당자)
6. 신청장소: 평내동 종합행정복지센터 맞춤형복지팀 (방문접수)
7. 문의처: 남양주시 복지정책과 (031-590-2605)`
  },
  {
    key: "medical",
    title: "외국인 계절근로자 및 다문화가정 의료지원 바우처 안내",
    content: `[남양주시 보건소 안내]
외국인 주민 및 농촌 계절근로자 무료 건강검진 및 독감 예방접종 지원 안내
1. 대상: 남양주시 관내 사업장 및 농가에 등록된 외국인 등록증 소지자
2. 내용: 흉부 X-ray, 혈액검사, 혈압/당뇨 기본 검진 및 인플루엔자 무료 예방접종
3. 일시: 2026년 4월 매주 수요일 오전 09:00 ~ 12:00
4. 장소: 남양주시 보건소 및 평내건강생활지원센터
5. 지참물: 외국인등록증(또는 여권)
6. 문의: 남양주시 보건행정과 (031-590-8000)`
  }
];

const DOC_UI_LABELS: {
  [lang: string]: {
    headerBadge: string;
    reportTitle: string;
    summaryTitle: string;
    termsTitle: string;
    datesTitle: string;
    targetTitle: string;
    docsTitle: string;
    whereTitle: string;
    appliedBadge: string;
  };
} = {
  ko: {
    headerBadge: "AI 해설 완료",
    reportTitle: "✨ 알기 쉬운 행정문서 요약 보고서",
    summaryTitle: "1. 한눈에 보는 핵심 요약",
    termsTitle: "2. 어려운 행정용어 쉬운말 풀이",
    datesTitle: "📅 중요 날짜 / 신청 기한:",
    targetTitle: "👤 지원 대상자:",
    docsTitle: "📝 준비할 서류 목록:",
    whereTitle: "🏛️ 신청 장소 및 문의처:",
    appliedBadge: "번역 적용됨"
  },
  en: {
    headerBadge: "AI Explanation Complete",
    reportTitle: "✨ Easy-to-Understand Administrative Report",
    summaryTitle: "1. Key Summary at a Glance",
    termsTitle: "2. Plain Language Glossary for Terms",
    datesTitle: "📅 Key Dates & Deadline:",
    targetTitle: "👤 Eligible Target Group:",
    docsTitle: "📝 Required Documents Checklist:",
    whereTitle: "🏛️ Where to Apply & Contacts:",
    appliedBadge: "English Applied"
  },
  zh: {
    headerBadge: "AI 解析完成",
    reportTitle: "✨ 通俗易懂的行政公文简明报告",
    summaryTitle: "1. 一目了然的核心要点",
    termsTitle: "2. 难懂行政术语通俗解释",
    datesTitle: "📅 重要日期 / 申请截止时间:",
    targetTitle: "👤 支援对象人群:",
    docsTitle: "📝 需准备的文件清单:",
    whereTitle: "🏛️ 申请地点及咨询处:",
    appliedBadge: "已应用中文翻译"
  },
  vi: {
    headerBadge: "AI phân tích hoàn tất",
    reportTitle: "✨ Báo cáo tóm tắt văn bản hành chính dễ hiểu",
    summaryTitle: "1. Tóm tắt nhanh các điểm chính",
    termsTitle: "2. Giải thích thuật ngữ hành chính dễ hiểu",
    datesTitle: "📅 Ngày quan trọng & Hạn nộp:",
    targetTitle: "👤 Đối tượng được hỗ trợ:",
    docsTitle: "📝 Giấy tờ cần chuẩn bị:",
    whereTitle: "🏛️ Địa điểm nộp & Liên hệ:",
    appliedBadge: "Đã áp dụng Tiếng Việt"
  },
  ja: {
    headerBadge: "AI解説完了",
    reportTitle: "✨ わかりやすい行政文書要約レポート",
    summaryTitle: "1. ひと目でわかる要約",
    termsTitle: "2. わかりやすい行政用語の解説",
    datesTitle: "📅 重要日程・申請締切:",
    targetTitle: "👤 支援対象者:",
    docsTitle: "📝 必要な提出書類リスト:",
    whereTitle: "🏛️ 申請場所・お問い合わせ:",
    appliedBadge: "日本語翻訳適用"
  },
  th: {
    headerBadge: "AI วิเคราะห์เสร็จสิ้น",
    reportTitle: "✨ สรุปเอกสารราชการแบบเข้าใจง่าย",
    summaryTitle: "1. สรุปประเด็นสำคัญอย่างย่อ",
    termsTitle: "2. อธิบายคำศัพท์ทางการแบบเข้าใจง่าย",
    datesTitle: "📅 วันสำคัญและกำหนดส่ง:",
    targetTitle: "👤 กลุ่มเป้าหมายที่ได้รับสิทธิ์:",
    docsTitle: "📝 รายการเอกสารที่ต้องเตรียม:",
    whereTitle: "🏛️ สถานที่ยื่นและข้อมูลติดต่อ:",
    appliedBadge: "แปลเป็นภาษาไทยแล้ว"
  },
  tl: {
    headerBadge: "Tapos na ang AI Analysis",
    reportTitle: "✨ Madaling Maintindihang Ulat ng Dokumento",
    summaryTitle: "1. Pangunahing Buod sa Isang Tingin",
    termsTitle: "2. Simpleng Paliwanag ng mga Termino",
    datesTitle: "📅 Mahalagang Petsa at Deadline:",
    targetTitle: "👤 Kwalipikadong Benepisyaryo:",
    docsTitle: "📝 Listahan ng mga Dokumento:",
    whereTitle: "🏛️ Lugar ng Pag-apply at Kontak:",
    appliedBadge: "Naka-Tagalog"
  },
  id: {
    headerBadge: "Analisis AI Selesai",
    reportTitle: "✨ Laporan Ringkasan Dokumen yang Mudah Dipahami",
    summaryTitle: "1. Ringkasan Poin Utama",
    termsTitle: "2. Penjelasan Istilah Administratif",
    datesTitle: "📅 Tanggal Penting & Batas Waktu:",
    targetTitle: "👤 Target Penerima Manfaat:",
    docsTitle: "📝 Daftar Dokumen yang Diperlukan:",
    whereTitle: "🏛️ Tempat Pengajuan & Kontak:",
    appliedBadge: "Bahasa Indonesia Diterapkan"
  },
  mn: {
    headerBadge: "AI шинжилгээ дууссан",
    reportTitle: "✨ Ойлгоход хялбар захиргааны баримтын тайлан",
    summaryTitle: "1. Гол агуулгын товчлол",
    termsTitle: "2. Хэцүү үг хэллэгийн хялбар тайлбар",
    datesTitle: "📅 Чухал хугацаа / Эцсийн хугацаа:",
    targetTitle: "👤 Хамрагдах иргэд:",
    docsTitle: "📝 Бүрдүүлэх бичиг баримт:",
    whereTitle: "🏛️ Өргөдөл өгөх газар, холбоо барих:",
    appliedBadge: "Монгол хэлээр орчуулав"
  },
  ru: {
    headerBadge: "Анализ AI завершен",
    reportTitle: "✨ Понятный отчет по официальному документу",
    summaryTitle: "1. Краткое содержание документа",
    termsTitle: "2. Простое объяснение сложных терминов",
    datesTitle: "📅 Важные даты и сроки подачи:",
    targetTitle: "👤 Категории получателей:",
    docsTitle: "📝 Список необходимых документов:",
    whereTitle: "🏛️ Место подачи и контакты:",
    appliedBadge: "Применен русский язык"
  }
};

function extractDigits(str: string): string {
  return str.replace(/[^0-9]/g, "");
}

export default function EasyDocsPage() {
  const [inputText, setInputText] = useState(SAMPLE_DOCS[0].content);
  const [selectedLang, setSelectedLang] = useState("ko");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeDocKey, setActiveDocKey] = useState<"emergency" | "medical">("emergency");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleSelectSample = (sample: typeof SAMPLE_DOCS[0]) => {
    setInputText(sample.content);
    setActiveDocKey(sample.key as "emergency" | "medical");
    setHasAnalyzed(false);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Identify document type from text
    const isMedical = inputText.includes("의료지원") || inputText.includes("건강검진") || inputText.includes("보건소") || inputText.includes("계절근로자");
    setActiveDocKey(isMedical ? "medical" : "emergency");

    setTimeout(() => {
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 400);
  };

  const currentLabels = DOC_UI_LABELS[selectedLang] || DOC_UI_LABELS.en;
  const currentReport: AdminDocReport =
    MULTILINGUAL_DOC_ANALYSIS[activeDocKey]?.[selectedLang] ||
    MULTILINGUAL_DOC_ANALYSIS[activeDocKey]?.en ||
    MULTILINGUAL_DOC_ANALYSIS.emergency.ko;

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
          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            이해하기 어려운 주민센터 공문서나 안내문을 복사해 넣으시면, AI가 <strong>어려운 행정용어를 쉬운 말로 풀고 10개국 다국어로 깔끔하게 번역</strong>해드립니다.
          </p>
        </div>

        {/* 샘플 공문서 선택 버튼 */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs font-bold text-slate-500">샘플 공문 선택:</span>
          {SAMPLE_DOCS.map((doc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(doc)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                inputText === doc.content
                  ? "bg-emerald-700 text-white border-2 border-emerald-800 scale-105"
                  : "bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50"
              }`}
            >
              📋 {doc.title}
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
              onClick={() => {
                setInputText("");
                setHasAnalyzed(false);
              }}
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
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">결과 번역 언어:</label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="px-3.5 py-2 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
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
                  AI가 공문서를 다국어로 알기 쉽게 분석 중...
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

        {/* AI 해설 결과 영역 */}
        {hasAnalyzed && currentReport && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-emerald-300 shadow-xl space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-slate-200">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {currentLabels.headerBadge}
                </span>
                <h2 className="font-heading text-xl md:text-2xl font-black text-slate-950 mt-1">
                  {currentLabels.reportTitle}
                </h2>
              </div>
              {selectedLang !== "ko" && (
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 w-fit">
                  <span>🌐</span>
                  <span>{SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName} {currentLabels.appliedBadge}</span>
                </span>
              )}
            </div>

            {/* 1. 핵심 요약 */}
            <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-300">
              <h3 className="font-black text-sm md:text-base text-emerald-950 flex items-center gap-1.5 mb-2.5">
                <i className="ri-checkbox-circle-fill text-emerald-600 text-lg"></i>
                {currentLabels.summaryTitle}
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-emerald-950 font-bold leading-relaxed">
                {currentReport.summary.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-emerald-700 font-extrabold mt-0.5 shrink-0">✔</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. 어려운 행정용어 쉬운말 사전 */}
            <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300">
              <h3 className="font-black text-sm md:text-base text-amber-950 flex items-center gap-1.5 mb-2.5">
                <i className="ri-book-open-fill text-amber-600 text-lg"></i>
                {currentLabels.termsTitle}
              </h3>
              <div className="space-y-2.5">
                {currentReport.terms.map((t, idx) => (
                  <div key={idx} className="text-xs md:text-sm bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs">
                    <strong className="text-amber-950 font-extrabold">{t.term}</strong>
                    <span className="mx-2 text-slate-400 font-bold">➔</span>
                    <span className="text-slate-900 font-bold">{t.explanation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 5대 핵심 실천 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-900 block mb-1 text-sm">{currentLabels.datesTitle}</strong>
                <span className="text-rose-700 font-extrabold text-sm">{currentReport.dates}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-900 block mb-1 text-sm">{currentLabels.targetTitle}</strong>
                <span className="text-slate-800 font-bold leading-relaxed">{currentReport.target}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-900 block mb-1 text-sm">{currentLabels.docsTitle}</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-800 font-bold">
                  {currentReport.documents.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-900 block mb-1 text-sm">{currentLabels.whereTitle}</strong>
                <p className="text-slate-800 font-bold leading-relaxed">{currentReport.whereToApply}</p>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <a
                    href={`tel:${extractDigits(currentReport.contact)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-lg font-black border border-emerald-400 active:scale-95 transition-all"
                    title="전화 걸기"
                  >
                    <span className="text-sm">📞</span>
                    <span className="underline underline-offset-2">{currentReport.contact}</span>
                    <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-black">통화</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
