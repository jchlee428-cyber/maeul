import { useTranslation } from "react-i18next";
import { useChatWidget } from "@/hooks/useChatWidget";

export default function Categories() {
  const { t } = useTranslation();
  const openChat = useChatWidget();

  const categories = [
    { key: "welfare", icon: "ri-hand-heart-line", name: t("categories.welfare.name", "복지"), desc: t("categories.welfare.desc", "기초생활·긴급지원·돌봄 등") },
    { key: "gov", icon: "ri-government-line", name: t("categories.gov.name", "행정"), desc: t("categories.gov.desc", "민원·서류·신고 절차 등") },
    { key: "health", icon: "ri-heart-pulse-line", name: t("categories.health.name", "의료"), desc: t("categories.health.desc", "건강보험·의료비·진료 등") },
    { key: "edu", icon: "ri-book-open-line", name: t("categories.edu.name", "교육"), desc: t("categories.edu.desc", "교육비·학습 지원 등") },
    { key: "housing", icon: "ri-home-4-line", name: t("categories.housing.name", "주거"), desc: t("categories.housing.desc", "임대·주거비·주택 등") },
    { key: "job", icon: "ri-briefcase-line", name: t("categories.job.name", "일자리"), desc: t("categories.job.desc", "취업·창업·훈련 등") },
    { key: "life", icon: "ri-store-2-line", name: t("categories.life.name", "생활"), desc: t("categories.life.desc", "생활비·급식·교통 등") },
    { key: "other", icon: "ri-more-line", name: t("categories.other.name", "기타"), desc: t("categories.other.desc", "그 밖의 어려움") },
  ];

  return (
    <section id="categories" className="w-full bg-background-50 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-accent-500 text-foreground-950">
            {t("categories.badge", "지원 분야")}
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold text-primary-700">
            {t("categories.title", "어떤 고민이든 시작할 수 있어요")}
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            {t("categories.desc", "생활 전반의 어려움을 분야별로 나누어 살펴봅니다. 카드를 클릭하면 맞춤 상담이 바로 시작됩니다.")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <button
              type="button"
              key={c.key}
              onClick={() => openChat({ category: c.name, query: `${c.name} 지원 제도 및 자원에 대해 상담받고 싶습니다.` })}
              className="group bg-white border border-primary-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary-500 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-left"
            >
              <span className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <i className={`${c.icon} text-3xl`}></i>
              </span>
              <h3 className="mt-4 font-heading text-lg md:text-xl font-bold text-foreground-900 group-hover:text-primary-700 transition-colors">
                {c.name}
              </h3>
              <p className="mt-1.5 text-xs md:text-sm text-foreground-600">
                {c.desc}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-600 group-hover:text-primary-800">
                상담 시작 <i className="ri-arrow-right-line"></i>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}