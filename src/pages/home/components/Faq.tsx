import { useState } from "react";

const faqs = [
  {
    q: "개인정보는 수집되나요?",
    a: "아니요. 상담을 위해 이름, 주민등록번호, 주소, 연락처 등 개인정보를 요구하지 않습니다. 문제 상황만 편하게 설명해주세요.",
  },
  {
    q: "비용이 드나요?",
    a: "아니요. 마을지기 상담은 무료로 이용하실 수 있습니다.",
  },
  {
    q: "AI 답변을 그대로 믿어도 되나요?",
    a: "AI 답변은 참고자료입니다. 지원 자격·조건 등 중요한 사항은 반드시 해당 공식기관에 직접 확인하시기 바랍니다.",
  },
  {
    q: "어떤 문제를 상담할 수 있나요?",
    a: "복지, 행정, 의료, 교육, 주거, 일자리, 생활 등 일상의 어려움 전반을 상담하실 수 있습니다. 분류가 어려워도 괜찮아요.",
  },
  {
    q: "긴급한 위기 상황인데 어떻게 하나요?",
    a: "생명·안전이 위급한 상황이라면 지체 없이 119(긴급신고) 또는 112(경찰) 등 공식 긴급 기관에 먼저 연락하시기 바랍니다.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full bg-background-50 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-accent-500 text-foreground-950">
            자주 묻는 질문
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold text-primary-700">
            궁금한 점을 정리했어요
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="bg-primary-50 border border-primary-200 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left"
              >
                <span className="font-heading text-base md:text-lg font-bold text-foreground-900">
                  {f.q}
                </span>
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full bg-primary-200 text-primary-800 shrink-0 transition-transform ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  <i className="ri-add-line"></i>
                </span>
              </button>
              {open === i && (
                <p className="px-5 md:px-6 pb-5 text-base text-foreground-700 leading-relaxed">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}