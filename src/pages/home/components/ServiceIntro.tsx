const pains = [
  {
    icon: "ri-search-eye-line",
    title: "어디서 도움받는지 몰라요",
    desc: "복지·행정 제도는 많지만, 내가 받을 수 있는지, 어디로 가야 하는지 알기 어렵습니다.",
  },
  {
    icon: "ri-file-text-line",
    title: "말이 너무 어려워요",
    desc: "공공기관 안내문은 전문용어가 많아, 정작 도움이 필요한 분이 이해하기 힘듭니다.",
  },
  {
    icon: "ri-emotion-sad-line",
    title: "물어보기 부담스러워요",
    desc: "개인정보를 내놓기 꺼려지거나, 도움을 요청하는 것 자체가 어려운 분들이 많습니다.",
  },
];

const values = [
  {
    icon: "ri-time-line",
    title: "빠르게 첫 방향 제시",
    desc: "문제 상황만 입력하면, 어떤 분야의 어떤 자원을 살펴봐야 할지 바로 정리해드립니다.",
  },
  {
    icon: "ri-translate-2",
    title: "쉬운 말로 번역",
    desc: "확인된 정보를 주민의 눈높이에 맞는 평이한 말로 다시 설명해드립니다.",
  },
  {
    icon: "ri-shield-check-line",
    title: "공식 확인 구분",
    desc: "확인되지 않은 정보와 반드시 공식기관에서 확인해야 할 정보를 명확히 나눕니다.",
  },
];

export default function ServiceIntro() {
  return (
    <section id="intro" className="w-full bg-background-50 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-accent-500 text-foreground-950">
            왜 필요할까요?
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold text-primary-700">
            필요한 도움을, 쉽고 부담 없이
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            마을지기는 주민을 대신해 판단하지 않습니다. 주민에게 필요한 지역사회 자원을 찾아
            이해하기 쉽게 정리하는 안내자입니다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {pains.map((p) => (
            <div
              key={p.title}
              className="bg-accent-50 border border-accent-200 rounded-lg p-6 md:p-7"
            >
              <span className="w-14 h-14 flex items-center justify-center rounded-lg bg-accent-200 text-accent-800">
                <i className={`${p.icon} text-2xl`}></i>
              </span>
              <h3 className="mt-4 font-heading text-lg md:text-xl font-bold text-foreground-900">
                {p.title}
              </h3>
              <p className="mt-2 text-base text-foreground-700 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 bg-primary-50 border border-primary-200 rounded-lg p-6 md:p-8">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4 items-start">
              <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-200 text-primary-800 shrink-0">
                <i className={`${v.icon} text-xl`}></i>
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground-900">{v.title}</h3>
                <p className="mt-1.5 text-base text-foreground-700 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}