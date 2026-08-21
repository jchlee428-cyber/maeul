import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import { caseStudies, performanceMetrics } from "@/data/casesData";
import { useChatWidget } from "@/hooks/useChatWidget";

export default function CasesPage() {
  const openChat = useChatWidget();

  return (
    <div className="bg-background-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-6xl mx-auto w-full">
        {/* 헤더 섹션 */}
        <div className="text-center max-w-3xl mx-auto mt-4 mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-bold rounded-full bg-accent-500 text-foreground-950 mb-3">
            실증 사업 성과 보고
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-800 leading-tight">
            실제 주민과 함께 만든 변화
          </h1>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            마을지기는 단순한 기술 아이디어가 아닌, 지역사회 현장에서 실제 주민 3명에게 적용하여
            <br className="hidden md:inline" />
            100% 공식자료 검증과 복지·행정 서비스 연결을 달성한 실증 모델입니다.
          </p>
        </div>

        {/* 성과 지표 대시보드 (사업계획서 9장) */}
        <div className="bg-primary-900 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-12">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="font-heading text-2xl font-bold text-accent-300">
              1차 실증 사업 성과 지표
            </h2>
            <p className="text-xs text-primary-200 mt-1">
              * 개인정보 비식별화 100% 및 공식 자료 교차 검증률 100% 달성
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {performanceMetrics.slice(0, 4).map((m) => (
              <div
                key={m.label}
                className="bg-primary-800/70 border border-primary-700 rounded-2xl p-4 text-center"
              >
                <div className="text-xs text-primary-300 font-medium">{m.label}</div>
                <div className="text-xl md:text-2xl font-bold text-white mt-1">
                  {m.current}
                </div>
                <span className="inline-block mt-2 px-2 py-0.5 text-[11px] bg-accent-500/20 text-accent-300 rounded-full font-semibold">
                  목표 {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3대 실증 사례 상세 카드 (사업계획서 8장) */}
        <div className="space-y-8">
          {caseStudies.map((cs, idx) => (
            <div
              key={cs.id}
              className="bg-white rounded-3xl border border-primary-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
                      {cs.tag}
                    </span>
                    <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground-900 mt-1">
                      {cs.title}
                    </h2>
                  </div>
                </div>
                <span className="text-xs text-foreground-600 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                  대상: {cs.residentType}
                </span>
              </div>

              {/* 단계별 프로세스 비교 */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* 1. 문제 상황 */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                    <i className="ri-error-warning-line"></i> 주민의 원래 어려움
                  </div>
                  <p className="text-foreground-800 leading-relaxed">{cs.issue}</p>
                </div>

                {/* 2. AI 분석 & 사람 검증 */}
                <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-200">
                  <div className="font-bold text-primary-900 flex items-center gap-1.5 mb-2">
                    <i className="ri-cpu-line"></i> AI 분석 & 사람의 검증
                  </div>
                  <p className="text-foreground-800 leading-relaxed mb-2">{cs.aiProcess}</p>
                  <div className="text-xs text-primary-700 font-medium pt-2 border-t border-primary-200">
                    🛡️ <strong>현장 검증:</strong> {cs.humanVerification}
                  </div>
                </div>

                {/* 3. 실제 연결 결과 & 만족도 */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                    <i className="ri-checkbox-circle-line"></i> 실제 연결 및 만족도
                  </div>
                  <p className="text-foreground-900 font-semibold leading-relaxed mb-2">
                    {cs.actualOutcome}
                  </p>
                  <p className="text-xs italic text-foreground-700 bg-white p-2.5 rounded-lg border border-emerald-200">
                    {cs.satisfaction}
                  </p>
                </div>
              </div>

              {/* 개선점 */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-foreground-600">
                <span>
                  💡 <strong>표준 매뉴얼 반영:</strong> {cs.improvements}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 CTA */}
        <div className="mt-16 bg-primary-50 border border-primary-200 rounded-3xl p-8 text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-primary-900">
            지금 우리 동네의 어려움을 상담해보세요
          </h2>
          <p className="mt-2 text-sm md:text-base text-foreground-700">
            개인정보 없이, 주민의 상황에 꼭 맞는 지역사회 자원을 찾아드립니다.
          </p>
          <button
            type="button"
            onClick={() => openChat()}
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-md"
          >
            <i className="ri-chat-3-line"></i>
            무료 AI 상담 시작하기
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
