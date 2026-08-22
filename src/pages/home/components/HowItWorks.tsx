const steps = [
  {
    n: "1",
    stepBadge: "1단계",
    title: "따뜻한 공감 & 경청",
    desc: "어르신의 힘든 마음에 먼저 깊이 공감하고, 겪고 계신 문제를 쉬운 말로 1문장 요약하여 확인합니다.",
    icon: "ri-heart-2-line",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    n: "2",
    stepBadge: "2단계",
    title: "딱 맞는 공공제도 안내",
    desc: "공공데이터를 기반으로 의료비·생계비·돌봄 등 주민에게 꼭 필요한 공식 지원 제도와 관할 기관을 찾습니다.",
    icon: "ri-government-line",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    n: "3",
    stepBadge: "3단계",
    title: "행동 순서 (① ➔ ② ➔ ③)",
    desc: "신분증 지참부터 방문·신청까지, 오늘과 내일 당장 주민이 행동하실 수 있는 순서를 명확하게 알려드립니다.",
    icon: "ri-footprint-line",
    color: "bg-amber-50 text-amber-800 border-amber-200"
  },
  {
    n: "4",
    stepBadge: "4단계",
    title: "안심 확인 & 사람 연결",
    desc: "AI의 한계를 명시하고 관공서 최종 확인을 돕습니다. 혼자 어려우시면 마을관리자가 직접 연결해드립니다.",
    icon: "ri-shield-check-line",
    color: "bg-purple-50 text-purple-700 border-purple-200"
  }
];

export default function HowItWorks() {
  return (
    <section id="how" className="w-full bg-background-100 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-accent-500 text-foreground-950">
            상담 프로세스
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold text-primary-700">
            알기 쉬운 4단계로 도와드려요
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            복잡한 행정 용어 없이, 마을지기가 주민의 눈높이에 맞춰 차근차근 정리합니다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className={`border rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow ${s.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm text-2xl font-bold">
                    <i className={s.icon}></i>
                  </span>
                  <span className="px-3 py-1 text-xs font-black rounded-full bg-white/80 border border-current shadow-xs">
                    {s.stepBadge}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-lg md:text-xl font-bold text-foreground-950">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-foreground-800 leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center text-xs font-semibold text-foreground-600">
                <span>실시간 맞춤 안내</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-2xl bg-white border border-primary-200 text-center max-w-3xl mx-auto shadow-sm">
          <p className="text-sm md:text-base text-foreground-800 leading-relaxed font-medium">
            💡 <strong>기억해주세요:</strong> 마을지기는 개인정보를 일체 묻지 않으며, 최종 결정은 항상 사람(공식 기관)과 함께 확인합니다.
          </p>
        </div>
      </div>
    </section>
  );
}