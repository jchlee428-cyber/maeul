import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChatWidget } from "@/hooks/useChatWidget";

export default function Hero() {
  const openChat = useChatWidget();
  const { t } = useTranslation();

  const badges = [
    t("hero.badges.0", "개인정보 수집 없음"),
    t("hero.badges.1", "무료 · 24시간 이용"),
    t("hero.badges.2", "공식 기관 확인 정보 구분")
  ];

  return (
    <section id="top" className="relative w-full flex items-center justify-center min-h-[560px] md:min-h-[640px] overflow-hidden py-16 md:py-20">
      <img
        src="https://readdy.ai/api/search-image?query=Warm%20and%20hopeful%20abstract%20illustration%20representing%20a%20caring%20local%20community%2C%20diverse%20group%20of%20neighbors%20silhouettes%20holding%20hands%20and%20supporting%20one%20another%2C%20soft%20sage%20green%20and%20warm%20amber%20color%20palette%2C%20flowing%20organic%20paper%20cutout%20shapes%20and%20gentle%20curved%20hills%2C%20small%20cozy%20houses%20and%20leafy%20trees%20arranged%20in%20background%2C%20reassuring%20and%20optimistic%20mood%2C%20soft%20diffused%20lighting%2C%20minimalist%20editorial%20style%2C%20clean%20composition%20with%20generous%20negative%20space&width=1600&height=900&seq=hero-community-01&orientation=landscape"
        alt="서로 돕는 따뜻한 지역사회를 표현한 일러스트"
        title="지역사회 문제 해결 AI 도우미 마을지기"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70"></div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 md:px-6">
        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm md:text-base font-semibold text-white bg-white/20 backdrop-blur rounded-full mb-6 border border-accent-300/40">
          <i className="ri-shield-check-line text-accent-300"></i>
          {t("hero.badge", "개인정보 없이 · 안심하고 나누는 상담")}
        </span>

        <h1 className="font-heading text-4xl md:text-6xl font-bold text-white leading-tight max-w-4xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
          {t("hero.title1", "어려움이 있어도,")}
          <br />
          {t("hero.title2", "혼자 고민하지 마세요")}
        </h1>

        <p className="mt-6 text-base md:text-xl text-white/95 max-w-3xl leading-relaxed">
          {t("hero.subtitle", "복지 · 행정 · 의료 · 교육 · 주거 · 일자리 — 우리 지역에서 받을 수 있는 도움을 찾아 이해하기 쉬운 말로 정리해드립니다.")}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => openChat()}
            className="inline-flex items-center gap-2.5 px-8 py-4 text-base md:text-lg font-bold rounded-full bg-primary-500 text-white hover:bg-primary-600 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-lg whitespace-nowrap"
          >
            <i className="ri-chat-3-line"></i>
            {t("hero.startBtn", "무료 상담 시작하기")}
          </button>
          
          <Link
            to="/guide"
            className="inline-flex items-center gap-2.5 px-8 py-4 text-base md:text-lg font-semibold rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 transition-colors whitespace-nowrap"
          >
            <i className="ri-book-open-line text-accent-300"></i>
            {t("hero.guideBtn", "자원 가이드 보기")}
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {badges.map((b) => (
            <span
              key={b}
              className="flex items-center gap-2 text-sm md:text-base text-white/95 whitespace-nowrap"
            >
              <i className="ri-checkbox-circle-fill text-accent-300"></i>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}