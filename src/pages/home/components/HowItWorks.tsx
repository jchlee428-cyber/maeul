const steps = [
  { n: "1", title: "핵심 문제 정의", desc: "주민이 겪는 어려움의 핵심을 한 문장으로 정리합니다." },
  { n: "2", title: "AI가 필요한 이유", desc: "왜 이 문제에 AI의 도움이 필요한지 설명합니다." },
  { n: "3", title: "지원 분야 분류", desc: "복지·행정·의료·교육·주거·일자리·생활·기타로 나눕니다." },
  { n: "4", title: "지역사회 자원 제시", desc: "살펴봐야 할 기관·제도·지원책을 찾아 제시합니다." },
  { n: "5", title: "정보 신뢰도 구분", desc: "확인되지 않은 정보와 공식기관 확인 필요 정보를 나눕니다." },
  { n: "6", title: "쉬운 말로 설명", desc: "확인된 정보를 주민이 이해하기 쉽게 다시 풀어드립니다." },
  { n: "7", title: "행동 순서 안내", desc: "주민이 실제로 해야 할 일을 ① ② ③ 순서로 정리합니다." },
  { n: "8", title: "AI 한계 고지", desc: "AI가 잘못 판단할 수 있는 부분을 미리 알려드립니다." },
  { n: "9", title: "사람 확인 사항", desc: "사람이 최종적으로 확인해야 할 사항을 제시합니다." },
  { n: "10", title: "재현 가능한 방법", desc: "다른 주민·지역에서도 활용할 수 있는 방법을 안내합니다." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="w-full bg-background-100 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-accent-500 text-foreground-950">
            이용 방법
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold text-primary-700">
            10단계로 차근차근 정리해드려요
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            문제 상황을 입력하시면, 마을지기가 아래 순서에 따라 답변을 정리합니다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-primary-50 border border-primary-200 rounded-lg p-5 flex flex-col"
            >
              <span className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-500 text-white text-base font-bold shrink-0">
                {s.n}
              </span>
              <h3 className="mt-3 font-heading text-base md:text-lg font-bold text-foreground-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm md:text-base text-foreground-700 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm md:text-base text-foreground-600 leading-relaxed">
          AI 답변은 참고자료이며, 최종 판단과 결정은 항상 사람이 합니다.
        </p>
      </div>
    </section>
  );
}