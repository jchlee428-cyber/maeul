const SITE_URL = import.meta.env.VITE_SITE_URL || "";

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "마을지기",
  url: SITE_URL,
  description: "AI 상담 서비스",
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "개인정보는 수집되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아니요. 상담을 위해 이름, 주민등록번호, 주소, 연락처 등 개인정보를 요구하지 않습니다. 문제 상황만 편하게 설명해주세요.",
      },
    },
    {
      "@type": "Question",
      name: "비용이 드나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아니요. 마을지기 상담은 무료로 이용하실 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "AI 답변을 그대로 믿어도 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI 답변은 참고자료입니다. 지원 자격·조건 등 중요한 사항은 반드시 해당 공식기관에 직접 확인하시기 바랍니다.",
      },
    },
    {
      "@type": "Question",
      name: "어떤 문제를 상담할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "복지, 행정, 의료, 교육, 주거, 일자리, 생활 등 일상의 어려움 전반을 상담하실 수 있습니다. 분류가 어려워도 괜찮아요.",
      },
    },
    {
      "@type": "Question",
      name: "긴급한 위기 상황인데 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "생명·안전이 위급한 상황이라면 지체 없이 119(긴급신고) 또는 112(경찰) 등 공식 긴급 기관에 먼저 연락하시기 바랍니다.",
      },
    },
  ],
};