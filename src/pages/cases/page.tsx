import { Link } from "react-router-dom";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import { caseStudies, performanceMetrics } from "@/data/casesData";

export default function CasesPage() {
  return (
    <div className="bg-background-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-6xl mx-auto w-full">
        {/* 헤더 섹션 */}
        <div className="text-center max-w-3xl mx-auto mt-4 mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-bold rounded-full bg-accent-500 text-foreground-950 mb-3">
            실증 사업 성과 보고
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-primary-800 leading-tight break-keep tracking-[-0.05em] sm:tracking-normal">
            실제 주민과 함께 만든 변화
          </h1>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed break-keep">
            마을지기는 단순한 기술 아이디어가 아닌, 지역사회 현장에서 실제 주민 3명에게 적용하여
            <br className="hidden md:inline" />
            100% 공식자료 검증과 복지·행정 서비스 연결을 달성한 실증 모델입니다.
          </p>
        </div>

        {/* 성과 지표 대시보드 (사업계획서 9장) */}
        <div className="bg-primary-900 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-12">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-accent-300 tracking-[-0.08em] sm:tracking-normal break-keep">
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

        {/* 2026 AI 활용 사례 공모전 핵심 시연 시나리오 (Section 19) */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-700/60">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                2026 AI 공모전 핵심 시연 시나리오
              </span>
              <h2 className="font-heading text-xl md:text-3xl font-black text-amber-300 mt-2">
                지역사회 외국인·다문화 주민의 복지 장벽 해소
              </h2>
            </div>
            <span className="text-xs text-indigo-200 bg-black/30 px-3 py-1.5 rounded-xl border border-indigo-500">
              검증 대상: 남양주시 평내동 거주 외국인 주민
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <strong className="text-amber-300 block text-sm">💬 주민의 질문 (User):</strong>
              <p className="text-slate-100 italic font-medium">
                "Tôi có con nhỏ đang nuôi tại Pyeongnae-dong. Có khoản hỗ trợ nào tôi có thể nhận được không?"<br />
                (아이를 키우고 있는데 평내동에서 받을 수 있는 지원이 있나요?)
              </p>
            </div>

            <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-500/50 space-y-2">
              <strong className="text-emerald-300 block text-sm">🤖 MAEUL AI의 실천적 해결:</strong>
              <p className="text-slate-100 font-medium">
                1) 남양주시 평내동 지역 확인 ➔ 2) 영유아 양육·다문화 바우처 탐색 ➔ 3) 9단계 표준 양식 구조화 ➔ 4) 베트남어 알기 쉬운 번역 ➔ 5) 평내동 복지팀(031-590-2605) 직통 연결
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-amber-400 text-slate-950 text-center font-heading font-black text-sm md:text-base">
            ✨ "AI가 주민과 행정기관 사이의 언어와 정보 장벽을 낮춥니다."
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-3xl p-8 text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-primary-900">
            지금 우리 동네의 어려움을 상담해보세요
          </h2>
          <p className="mt-2 text-sm md:text-base text-foreground-700">
            개인정보 없이, 주민의 상황에 꼭 맞는 지역사회 자원을 찾아드립니다.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <i className="ri-chat-voice-fill text-xl text-accent-300"></i>
            1:1 마을지기 AI 무료 상담 시작하기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
