const principles = [
  {
    icon: "ri-lock-line",
    title: "개인정보를 요구하지 않습니다",
    desc: "이름·주민등록번호·주소 등 개인정보는 묻지 않습니다. 문제 상황만으로 상담할 수 있습니다.",
  },
  {
    icon: "ri-error-warning-line",
    title: "확인되지 않은 정보를 사실로 말하지 않습니다",
    desc: "출처가 불분명한 정보는 '확인 필요'로 구분하고, 사실처럼 단정하지 않습니다.",
  },
  {
    icon: "ri-close-circle-line",
    title: "존재하지 않는 기관·제도를 만들지 않습니다",
    desc: "실제로 존재하는 공식 제도와 기관만 안내하고, 지어내지 않습니다.",
  },
  {
    icon: "ri-user-heart-line",
    title: "최종 판단은 사람이 합니다",
    desc: "AI 답변은 어디까지나 참고자료입니다. 중요한 결정은 반드시 사람(공식기관)과 확인하세요.",
  },
];

const aiLimits = [
  "최신 제도·지원 기준은 수시로 바뀔 수 있어, 시점이 어긋날 수 있습니다.",
  "지역마다 지원 조건과 담당 기관이 달라, 내 지역 기준과 다를 수 있습니다.",
  "개인의 정확한 자격 요건(소득·연령 등)은 기관 상담을 통해서만 확정됩니다.",
  "의료·법률 등 전문 영역은 전문가의 판단을 대신할 수 없습니다.",
];

export default function Principles() {
  return (
    <section id="principles" className="w-full bg-background-100 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-accent-500 text-foreground-950">
            우리 원칙
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold text-primary-700">
            신뢰할 수 있게, 안전하게
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            마을지기는 네 가지 원칙을 가장 중요하게 지킵니다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {principles.map((p) => (
            <div
              key={p.title}
              className="bg-accent-50 border border-accent-200 rounded-lg p-6 md:p-7 flex gap-4"
            >
              <span className="w-14 h-14 flex items-center justify-center rounded-lg bg-accent-200 text-accent-800 shrink-0">
                <i className={`${p.icon} text-2xl`}></i>
              </span>
              <div>
                <h3 className="font-heading text-lg md:text-xl font-bold text-foreground-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-base text-foreground-700 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-accent-50 border border-accent-200 rounded-lg p-6 md:p-8">
          <h3 className="flex items-center gap-2 font-heading text-lg md:text-xl font-bold text-foreground-900">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-accent-500 text-white">
              <i className="ri-alert-line"></i>
            </span>
            AI가 잘못 판단할 수 있는 부분
          </h3>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiLimits.map((t) => (
              <li key={t} className="flex gap-2.5 text-base text-foreground-800 leading-relaxed">
                <i className="ri-arrow-right-s-line text-secondary-600 mt-0.5 shrink-0"></i>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}