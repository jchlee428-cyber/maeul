import { useState, useRef } from "react";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import {
  SUPPORTED_LANGUAGES,
  analyzeCustomAdminDoc,
  type AdminDocReport
} from "@/services/multilingualEngine";
import {
  parseDocumentFile,
  type ParsedDocumentResult
} from "@/services/documentParser";

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function getFileIcon(fileName: string): string {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (ext === ".pdf") return "📄";
  if (ext === ".hwp" || ext === ".hwpx" || ext === ".hws") return "🇰🇷";
  if (ext === ".docx" || ext === ".doc") return "📝";
  return "📃";
}

function buildMarkdownText(
  report: AdminDocReport,
  labels: typeof DOC_UI_LABELS.ko,
  fileName?: string,
  langName?: string
): string {
  const lines: string[] = [];
  lines.push(`# ${labels.reportTitle.replace(/[✨\s]+/g, " ").trim()}`);
  if (fileName) {
    lines.push(`> 📎 **원본 파일**: ${fileName}`);
  }
  if (langName) {
    lines.push(`> 🌐 **번역 언어**: ${langName}`);
  }
  lines.push("");
  lines.push(`## ${labels.summaryTitle}`);
  report.summary.forEach((s) => {
    lines.push(`- **${s}**`);
  });
  lines.push("");
  lines.push(`## ${labels.termsTitle}`);
  report.terms.forEach((t) => {
    lines.push(`- **${t.term}**: ${t.explanation}`);
  });
  lines.push("");
  lines.push(`## 📌 주요 세부 정보`);
  lines.push(`| 구분 | 내용 |`);
  lines.push(`| :--- | :--- |`);
  lines.push(`| **${labels.datesTitle.replace(/[📅\s:]+/g, "")}** | ${report.dates} |`);
  lines.push(`| **${labels.targetTitle.replace(/[👤\s:]+/g, "")}** | ${report.target} |`);
  lines.push(`| **${labels.whereTitle.replace(/[🏛️\s:]+/g, "")}** | ${report.whereToApply} |`);
  lines.push(`| **문의처** | ${report.contact} |`);
  lines.push("");
  lines.push(`## ${labels.docsTitle}`);
  report.documents.forEach((d) => {
    lines.push(`- [ ] ${d}`);
  });
  lines.push("");
  lines.push(`---`);
  lines.push(`*출처: 마을지기 AI (MAEUL AI) 행정문서 분석 엔진*`);
  return lines.join("\n");
}

export default function EasyDocsPage() {
  const [inputText, setInputText] = useState(SAMPLE_DOCS[0].content);
  const [selectedLang, setSelectedLang] = useState("ko");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload");

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileMeta, setUploadedFileMeta] = useState<ParsedDocumentResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis result & Markdown view state
  const [reportResult, setReportResult] = useState<AdminDocReport | null>(null);
  const [copiedMd, setCopiedMd] = useState(false);
  const [showMdCode, setShowMdCode] = useState(false);

  const handleSelectSample = (sample: typeof SAMPLE_DOCS[0]) => {
    setInputText(sample.content);
    setUploadedFileMeta(null);
    setUploadError(null);
    setHasAnalyzed(false);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const result = await parseDocumentFile(file);
      setUploadedFileMeta(result);
      setInputText(result.text);
      setHasAnalyzed(false);
    } catch (err: unknown) {
      console.error("Document parsing error:", err);
      setUploadError(
        err instanceof Error
          ? err.message
          : "파일을 읽어오는 중 오류가 발생했습니다. 파일 형식을 확인해주세요."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setInputText("");
    setUploadedFileMeta(null);
    setUploadError(null);
    setHasAnalyzed(false);
    setReportResult(null);
    setShowMdCode(false);
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const report = analyzeCustomAdminDoc(inputText, selectedLang);
      setReportResult(report);
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 450);
  };

  const handleLangChange = (newLang: string) => {
    setSelectedLang(newLang);
    if (hasAnalyzed && inputText.trim()) {
      const updatedReport = analyzeCustomAdminDoc(inputText, newLang);
      setReportResult(updatedReport);
    }
  };

  const currentLabels = DOC_UI_LABELS[selectedLang] || DOC_UI_LABELS.en;
  const activeReport = reportResult || (hasAnalyzed ? analyzeCustomAdminDoc(inputText, selectedLang) : null);
  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang);

  const markdownString = activeReport
    ? buildMarkdownText(
        activeReport,
        currentLabels,
        uploadedFileMeta?.fileName,
        langObj ? `${langObj.name} (${langObj.nativeName})` : undefined
      )
    : "";

  const handleCopyMarkdown = () => {
    if (!markdownString) return;
    navigator.clipboard.writeText(markdownString);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!markdownString) return;
    const blob = new Blob([markdownString], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const baseName = uploadedFileMeta?.fileName
      ? uploadedFileMeta.fileName.replace(/\.[^/.]+$/, "")
      : "행정문서_요약보고서";
    link.href = url;
    link.download = `${baseName}_AI해설.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-5xl mx-auto w-full">
        {/* 상단 타이틀 */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="px-3.5 py-1 text-xs font-black rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            EASY ADMINISTRATIVE DOCUMENTS & MULTILINGUAL AI
          </span>
          <h1 className="font-heading text-2xl md:text-4xl font-black text-slate-950 mt-2">
            📄 행정문서 쉽게 보기
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            주민센터 공문서나 안내문 파일을 <strong>(PDF, HWP, HWPX, HWS, DOCX, TXT)</strong> 직접 올리시거나 텍스트를 붙여넣으시면,
            AI가 <strong>어려운 행정용어를 쉬운 말로 풀고 10개국 다국어 및 마크다운(MD)으로 출력</strong>해드립니다.
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
                inputText === doc.content && !uploadedFileMeta
                  ? "bg-emerald-700 text-white border-2 border-emerald-800 scale-105"
                  : "bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50"
              }`}
            >
              📋 {doc.title}
            </button>
          ))}
        </div>

        {/* 입력 모드 탭 & 입력 카드 */}
        <div className="bg-white p-6 md:p-7 rounded-3xl border-2 border-slate-200 shadow-md mb-8 space-y-5">
          {/* 상단 탭 전환 및 내용 지우기 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  activeTab === "upload"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📎 파일 업로드</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-800 text-emerald-100 font-normal">
                  PDF·HWP·DOCX·TXT
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  activeTab === "text"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>✍️ 텍스트 직접 입력</span>
              </button>
            </div>

            {(inputText || uploadedFileMeta) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <i className="ri-delete-bin-line"></i>
                내용 초기화
              </button>
            )}
          </div>

          {/* 에러 메시지 */}
          {uploadError && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs text-rose-800 font-bold flex items-start gap-2 animate-fadeIn">
              <span className="text-base">⚠️</span>
              <div className="flex-1">
                <p>{uploadError}</p>
                <p className="text-[11px] text-rose-600 mt-0.5 font-normal">
                  지원 형식: PDF (.pdf), 한글 문서 (.hwp, .hwpx, .hws), 워드 (.docx, .doc), 텍스트 (.txt, .md, .csv)
                </p>
              </div>
            </div>
          )}

          {/* 1) 파일 업로드 탭 내용 */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.hwp,.hwpx,.hws,.docx,.doc,.txt,.csv,.md,.tsv,.log"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {!uploadedFileMeta ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-50 scale-[1.01]"
                      : "border-slate-300 hover:border-emerald-500 hover:bg-slate-50 bg-slate-50/60"
                  }`}
                >
                  {isUploading ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-black text-slate-800">
                        문서 파일에서 텍스트를 고속 추출하는 중입니다...
                      </p>
                      <p className="text-xs text-slate-500">
                        PDF 페이지 분석, 한글(HWP/HWPX) 디코딩, Word 본문 파싱 진행 중
                      </p>
                    </div>
                  ) : (
                    <div className="py-3 flex flex-col items-center justify-center gap-2.5">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl shadow-xs">
                        <i className="ri-upload-cloud-2-line"></i>
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900">
                          이곳을 클릭하거나 파일을 끌어다 놓으세요
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          공문서, 복지 안내문, 주민센터 공지사항 파일을 올리면 AI가 즉시 분석합니다
                        </p>
                      </div>

                      {/* 지원 파일 포맷 태그 */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 pt-2 border-t border-slate-200 max-w-lg">
                        <span className="px-2.5 py-1 bg-red-100 text-red-800 font-bold rounded-lg text-[11px] border border-red-200">
                          🔴 PDF (.pdf)
                        </span>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg text-[11px] border border-blue-200">
                          🔵 한글 (.hwp, .hwpx, .hws)
                        </span>
                        <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-bold rounded-lg text-[11px] border border-sky-200">
                          🟦 Word (.docx, .doc)
                        </span>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px] border border-emerald-200">
                          🟢 텍스트 (.txt, .md, .csv)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 업로드 완료 상태 카드 */
                <div className="p-4 md:p-5 bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-emerald-200">
                        {getFileIcon(uploadedFileMeta.fileName)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-emerald-950 truncate max-w-xs md:max-w-md">
                            {uploadedFileMeta.fileName}
                          </h4>
                          <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-black rounded-md">
                            {uploadedFileMeta.fileType}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700 font-bold mt-0.5">
                          용량: {formatBytes(uploadedFileMeta.fileSize)} | 본문: 약 {uploadedFileMeta.charCount.toLocaleString()}자 추출 완료
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-black shadow-xs transition-all"
                      >
                        🔄 다른 파일로 변경
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFileMeta(null);
                          setInputText("");
                          setHasAnalyzed(false);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-black shadow-xs transition-all"
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  {/* 추출된 텍스트 미리보기 토글 */}
                  <div className="pt-2 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      <span>{showExtractedPreview ? "▼ 추출된 텍스트 접기" : "▶ 추출된 텍스트 미리보기/직접 수정"}</span>
                    </button>

                    {showExtractedPreview && (
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={6}
                        className="w-full mt-2 p-3 bg-white border border-emerald-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
                        placeholder="추출된 본문 텍스트"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2) 텍스트 직접 입력 탭 내용 */}
          {activeTab === "text" && (
            <div className="space-y-2">
              <label className="font-black text-xs text-slate-700 flex items-center gap-1">
                <i className="ri-edit-line text-emerald-700"></i>
                행정 공문서 본문 텍스트 붙여넣기
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={7}
                placeholder="공문서나 주민센터 안내문 내용을 여기에 직접 붙여넣으세요..."
                className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
              />
            </div>
          )}

          {/* 하단 언어 선택 및 AI 분석 실행 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                🌐 결과 번역 언어:
              </label>
              <select
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="px-3.5 py-2.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
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
              disabled={isAnalyzing || isUploading || !inputText.trim()}
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
        {hasAnalyzed && activeReport && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-emerald-300 shadow-xl space-y-6 animate-fadeIn">
            {/* 상단 헤더 & 마크다운 내보내기 툴바 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {currentLabels.headerBadge}
                </span>
                <h2 className="font-heading text-xl md:text-2xl font-black text-slate-950 mt-1">
                  {currentLabels.reportTitle}
                </h2>
                {uploadedFileMeta && (
                  <p className="text-xs text-emerald-800 font-bold mt-1">
                    📎 원본 파일: {uploadedFileMeta.fileName} ({uploadedFileMeta.fileType})
                  </p>
                )}
              </div>

              {/* 마크다운 조작 버튼 그룹 */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedLang !== "ko" && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>{langObj?.nativeName} {currentLabels.appliedBadge}</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className={`px-3 py-1.5 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 shadow-xs ${
                    copiedMd
                      ? "bg-emerald-600 text-white border-emerald-700"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                  }`}
                  title="마크다운 형식으로 클립보드에 복사"
                >
                  <i className={copiedMd ? "ri-check-line" : "ri-file-copy-line"}></i>
                  <span>{copiedMd ? "복사 완료!" : "마크다운 복사"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="px-3 py-1.5 text-xs font-black rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all flex items-center gap-1.5 shadow-xs"
                  title="마크다운 (.md) 파일로 저장"
                >
                  <i className="ri-download-2-line"></i>
                  <span>.md 다운로드</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMdCode(!showMdCode)}
                  className={`px-3 py-1.5 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 shadow-xs ${
                    showMdCode
                      ? "bg-emerald-700 text-white border-emerald-800"
                      : "bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-300"
                  }`}
                >
                  <i className="ri-code-s-slash-line"></i>
                  <span>{showMdCode ? "카드 뷰 보기" : "마크다운 원문 보기"}</span>
                </button>
              </div>
            </div>

            {/* 마크다운 원문 뷰어 (활성화 시) */}
            {showMdCode ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <i className="ri-markdown-line text-emerald-600"></i> 마크다운 (Markdown) 소스 코드
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMarkdown}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    {copiedMd ? "✓ 복사됨" : "전체 복사"}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={markdownString}
                  rows={14}
                  className="w-full p-4 bg-slate-900 text-emerald-300 rounded-2xl font-mono text-xs leading-relaxed focus:outline-none border-2 border-slate-700 select-all"
                />
              </div>
            ) : (
              /* 일반 리포트 카드 뷰 */
              <>
                {/* 1. 핵심 요약 */}
                <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-300">
                  <h3 className="font-black text-sm md:text-base text-emerald-950 flex items-center gap-1.5 mb-2.5">
                    <i className="ri-checkbox-circle-fill text-emerald-600 text-lg"></i>
                    {currentLabels.summaryTitle}
                  </h3>
                  <ul className="space-y-2 text-xs md:text-sm text-emerald-950 font-bold leading-relaxed">
                    {activeReport.summary.map((s, idx) => (
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
                    {activeReport.terms.map((t, idx) => (
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
                    <span className="text-rose-700 font-extrabold text-sm">{activeReport.dates}</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                    <strong className="text-slate-900 block mb-1 text-sm">{currentLabels.targetTitle}</strong>
                    <span className="text-slate-800 font-bold leading-relaxed">{activeReport.target}</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                    <strong className="text-slate-900 block mb-1 text-sm">{currentLabels.docsTitle}</strong>
                    <ul className="list-disc pl-4 space-y-1 text-slate-800 font-bold">
                      {activeReport.documents.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                    <strong className="text-slate-900 block mb-1 text-sm">{currentLabels.whereTitle}</strong>
                    <p className="text-slate-800 font-bold leading-relaxed">{activeReport.whereToApply}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <a
                        href={`tel:${extractDigits(activeReport.contact)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-lg font-black border border-emerald-400 active:scale-95 transition-all"
                        title="전화 걸기"
                      >
                        <span className="text-sm">📞</span>
                        <span className="underline underline-offset-2">{activeReport.contact}</span>
                        <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-black">통화</span>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
