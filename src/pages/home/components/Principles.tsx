const principles = [
  {
    icon: "ri-shield-keyhole-line",
    title: "1. 개인정보 절대 수집 금지",
    desc: "주민등록번호, 실명, 계좌번호 등 민감한 개인정보는 일체 묻지 않습니다. 오직 겪고 계신 문제 상황만으로 필요한 공공 자원을 찾습니다.",
    color: "bg-emerald-500 text-white"
  },
  {
    icon: "ri-government-line",
    title: "2. 검증된 공공데이터 기반 안내",
    desc: "존재하지 않는 기관이나 제도를 지어내지 않습니다. 공공데이터포털 및 지자체 공식 고시 원문 데이터를 기반으로 정확하게 안내합니다.",
    color: "bg-blue-500 text-white"
  },
  {
    icon: "ri-chat-smile-2-line",
    title: "3. 쉬운 우리말 설명 (어르신 눈높이)",
    desc: "어려운 법률·행정 용어 대신, 어르신과 주민이 일상에서 편안하게 이해할 수 있는 쉬운 우리말로 풀어서 설명합니다.",
    color: "bg-amber-500 text-white"
  },
];

const aiLimits = [
  "최신 지원 기준이나 소득 판정 기준은 관할 주민센터 등 공식 기관의 최종 확인이 필요합니다.",
  "AI 답변은 주민의 이해를 돕기 위한 참고자료이며, 최종 결정은 항상 사람(전문가/공무원)이 내립니다.",
  "의료 시술 판단이나 법률적 다툼 등 전문 영역은 해당 전문기관 및 전문가의 상담을 대신할 수 없습니다.",
  "신청이 혼자 어려우신 경우 '도움 요청하기'를 통해 마을관리자 및 복지 담당자의 도움을 받으실 수 있습니다."
];

export default function Principles() {
  return (
    <section id="principles" className="w-full bg-background-100 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-accent-500 text-foreground-950">
            마을지기 원칙
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold text-primary-700">
            3대 절대 원칙과 안심 약속
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            마을지기는 주민과 어르신의 안전과 신뢰를 가장 최우선으로 생각합니다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-primary-200 rounded-2xl p-6 md:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <span className={`w-14 h-14 flex items-center justify-center rounded-xl ${p.color} shadow-sm shrink-0 mb-4`}>
                  <i className={`${p.icon} text-2xl`}></i>
                </span>
                <h3 className="font-heading text-lg md:text-xl font-bold text-foreground-950">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-foreground-700 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-amber-50/90 border border-amber-300 rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="flex items-center gap-2.5 font-heading text-lg md:text-xl font-bold text-amber-950">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-500 text-white shrink-0">
              <i className="ri-shield-alert-line"></i>
            </span>
            꼭 기억해주세요 (이용 시 유의사항)
          </h3>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiLimits.map((t, idx) => (
              <li key={idx} className="flex gap-2.5 text-sm md:text-base text-amber-950 leading-relaxed">
                <i className="ri-checkbox-circle-fill text-amber-600 mt-0.5 shrink-0"></i>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}