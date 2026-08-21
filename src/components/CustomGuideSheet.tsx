import { useRef } from "react";
import type { CommunityResource } from "@/data/communityResources";

interface CustomGuideSheetProps {
  resource: CommunityResource | null;
  userQuery?: string;
  onClose: () => void;
}

export default function CustomGuideSheet({
  resource,
  userQuery,
  onClose,
}: CustomGuideSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!resource) return null;

  // 완벽한 A4 1장 독립 인쇄 (iframe 방식: 배경 웹페이지 간섭 100% 원천 차단)
  const handlePrint = () => {
    if (!contentRef.current) return;

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    const htmlContent = contentRef.current.innerHTML;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>${resource.title} - 주민 맞춤형 안내서</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700;900&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 10mm 10mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Noto Sans KR', sans-serif;
            color: #111827;
            background: #ffffff;
            width: 100%;
            height: auto;
          }
          .guide-container {
            width: 100%;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 16px 20px;
            background: #ffffff;
          }
          .guide-header {
            border-bottom: 2px solid #15803d;
            padding-bottom: 10px;
            margin-bottom: 12px;
          }
          .guide-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #4b5563;
            margin-bottom: 4px;
          }
          .badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            border: 1px solid #86efac;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 11px;
          }
          h1 {
            font-family: 'Noto Serif KR', serif;
            font-size: 20px;
            color: #14532d;
            margin-bottom: 4px;
            line-height: 1.3;
          }
          .user-summary {
            font-size: 11px;
            background: #fef3c7;
            border: 1px solid #fde68a;
            color: #78350f;
            padding: 4px 8px;
            border-radius: 4px;
            margin-bottom: 6px;
          }
          .plain-summary {
            font-size: 12px;
            color: #374151;
            font-weight: 500;
            line-height: 1.4;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 10px;
          }
          .col-span-2 {
            grid-column: span 2;
          }
          .card {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 8px 10px;
            background: #ffffff;
          }
          .card-primary {
            background: #f0fdf4;
            border: 1px solid #86efac;
          }
          .card-title {
            font-size: 11px;
            font-weight: 700;
            color: #166534;
            margin-bottom: 3px;
          }
          .card-content {
            font-size: 11px;
            color: #1f2937;
            line-height: 1.4;
          }
          .card-action {
            font-size: 12px;
            font-weight: 700;
            color: #14532d;
            line-height: 1.4;
          }
          .contact-row {
            display: flex;
            gap: 16px;
            align-items: center;
            font-weight: 700;
            font-size: 12px;
            color: #15803d;
            margin-top: 2px;
          }
          .contact-row span {
            color: #4b5563;
            font-weight: 400;
            font-size: 11px;
          }
          .notice-box {
            margin-top: 10px;
            background: #fffbeb;
            border: 1px solid #fef08a;
            border-radius: 6px;
            padding: 8px 10px;
          }
          .notice-title {
            font-size: 10px;
            font-weight: 700;
            color: #854d0e;
            margin-bottom: 2px;
          }
          .notice-text {
            font-size: 10px;
            color: #374151;
            line-height: 1.35;
          }
          .footer-note {
            margin-top: 8px;
            text-align: right;
            font-size: 9px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="guide-container">
          <div class="guide-header">
            <div class="guide-meta">
              <span class="badge">지원 분야: ${resource.categoryLabel}</span>
              <span>마을지기 주민 맞춤형 안내서 | 발행일: ${new Date().toLocaleDateString("ko-KR")}</span>
            </div>
            <h1>${resource.title}</h1>
            ${userQuery ? `<div class="user-summary"><strong>상담 의뢰 요약:</strong> "${userQuery}"</div>` : ""}
            <div class="plain-summary">💡 ${resource.plainSummary}</div>
          </div>

          <div class="grid-2">
            <div class="card">
              <div class="card-title">1. 이것은 무엇인가요?</div>
              <div class="card-content">${resource.questions.what}</div>
            </div>

            <div class="card">
              <div class="card-title">2. 나에게 해당되나요? (지원 대상)</div>
              <div class="card-content" style="font-weight:600;">${resource.questions.who}</div>
            </div>

            <div class="card card-primary col-span-2">
              <div class="card-title" style="font-size:12px;">3. 내가 지금 해야 할 일 (행동 순서)</div>
              <div class="card-action">👉 ${resource.questions.action}</div>
            </div>

            <div class="card">
              <div class="card-title">4. 무엇을 준비해야 하나요?</div>
              <div class="card-content">${resource.questions.preparation}</div>
            </div>

            <div class="card">
              <div class="card-title">5. 언제까지 신청해야 하나요?</div>
              <div class="card-content">${resource.questions.deadline}</div>
            </div>

            <div class="card col-span-2">
              <div class="card-title">6. 어디에 문의하고 접수하나요?</div>
              <div class="contact-row">
                <div>📞 ${resource.contact}</div>
                <span>🏢 소관: ${resource.organization}</span>
              </div>
            </div>
          </div>

          <div class="notice-box">
            <div class="notice-title">⚠️ 꼭 확인하세요! (담당자 교차 확인 사항)</div>
            <div class="notice-text">${resource.humanVerificationNotes}</div>
          </div>

          <div class="footer-note">
            * 마을지기 AI 안내 정보는 참고자료이며, 주민센터 복지팀 등 공식 담당자의 사실 확인을 거쳐 최종 신청하시기 바랍니다.
          </div>
        </div>
      </body>
      </html>
    `);
    doc.close();

    // 폰트 및 리소스 렌더링 대기 후 인쇄 트리거
    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-primary-200 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 bg-primary-700 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-white text-primary-700 flex items-center justify-center font-bold">
              <i className="ri-file-list-3-line"></i>
            </span>
            <div>
              <h2 className="font-heading font-bold text-lg md:text-xl">주민 맞춤형 생활안내서 (A4 1장 요약)</h2>
              <p className="text-xs text-primary-100">마을지기 | 공공·지역사회 자원 쉬운 말 정리</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg bg-accent-500 text-foreground-950 hover:bg-accent-400 transition-colors shadow"
            >
              <i className="ri-printer-line"></i>
              A4 1장 인쇄 / PDF 저장
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="닫기"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        {/* 화면 미리보기 본문 (ref로 연결) */}
        <div ref={contentRef} className="p-6 md:p-7 overflow-y-auto text-foreground-900 bg-[#FAFAF8] space-y-4">
          {/* 상단 타이틀 */}
          <div className="border-b-2 border-primary-700 pb-3">
            <div className="flex items-center justify-between text-xs text-foreground-600 mb-1">
              <span className="px-2.5 py-0.5 font-bold rounded bg-primary-100 text-primary-900 border border-primary-300">
                지원 분야: {resource.categoryLabel}
              </span>
              <span>
                마을지기 맞춤 안내서 | 발행일: {new Date().toLocaleDateString("ko-KR")}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-primary-950 leading-tight">
              {resource.title}
            </h1>
            {userQuery && (
              <p className="mt-1.5 text-xs bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded">
                <strong>상담 상황 요약:</strong> "{userQuery}"
              </p>
            )}
            <p className="mt-1.5 text-xs md:text-sm text-foreground-800 font-medium leading-snug">
              💡 {resource.plainSummary}
            </p>
          </div>

          {/* 6대 핵심 질문 구조 (2열 컴팩트 카드) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            {/* 1. 이것은 무엇인가? */}
            <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-primary-900 font-bold text-xs mb-1">
                <i className="ri-question-line text-primary-700"></i>
                1. 이것은 무엇인가요?
              </div>
              <p className="text-foreground-800 leading-relaxed">
                {resource.questions.what}
              </p>
            </div>

            {/* 2. 나에게 해당되는가? */}
            <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-primary-900 font-bold text-xs mb-1">
                <i className="ri-user-star-line text-primary-700"></i>
                2. 나에게 해당되나요? (지원 대상)
              </div>
              <p className="text-foreground-800 leading-relaxed font-semibold">
                {resource.questions.who}
              </p>
            </div>

            {/* 3. 내가 해야 할 일 (행동 순서) */}
            <div className="md:col-span-2 p-3 rounded-lg bg-primary-50 border border-primary-300 shadow-sm">
              <div className="flex items-center gap-1.5 text-primary-950 font-bold text-xs mb-1">
                <i className="ri-checkbox-circle-line text-primary-700 text-sm"></i>
                3. 내가 지금 해야 할 일 (행동 순서)
              </div>
              <p className="text-foreground-950 font-semibold leading-relaxed">
                👉 {resource.questions.action}
              </p>
            </div>

            {/* 4. 준비물 */}
            <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-primary-900 font-bold text-xs mb-1">
                <i className="ri-file-list-line text-primary-700"></i>
                4. 무엇을 준비해야 하나요?
              </div>
              <p className="text-foreground-800 leading-relaxed">
                {resource.questions.preparation}
              </p>
            </div>

            {/* 5. 신청 기한 */}
            <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-primary-900 font-bold text-xs mb-1">
                <i className="ri-calendar-check-line text-primary-700"></i>
                5. 언제까지 신청해야 하나요?
              </div>
              <p className="text-foreground-800 leading-relaxed">
                {resource.questions.deadline}
              </p>
            </div>

            {/* 6. 어디에 문의하나? */}
            <div className="md:col-span-2 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-primary-900 font-bold text-xs mb-0.5">
                <i className="ri-phone-line text-primary-700"></i>
                6. 어디에 문의하고 접수하나요?
              </div>
              <div className="text-foreground-900 font-bold text-xs flex flex-wrap items-center gap-4 mt-0.5">
                <span className="text-primary-800 font-bold">📞 {resource.contact}</span>
                <span className="text-foreground-600 font-normal">🏢 {resource.organization}</span>
              </div>
            </div>
          </div>

          {/* 사람의 최종 검증 안내 */}
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-foreground-800">
            <div className="flex items-center gap-1 text-amber-950 font-bold text-[11px] mb-0.5">
              <i className="ri-alert-line text-amber-700"></i>
              꼭 확인하세요! (담당자 교차 확인 사항)
            </div>
            <p className="leading-snug text-[11px]">
              {resource.humanVerificationNotes}
            </p>
            <p className="text-[10px] text-foreground-500 mt-1">
              * 마을지기 AI 정보는 참고자료이며, 주민센터 복지팀 등 공식 담당자의 사실 확인을 거쳐 최종 신청하시기 바랍니다.
            </p>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span>개인정보 없이 안심하는 AI 도우미 마을지기</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
