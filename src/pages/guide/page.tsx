import { useState } from "react";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import { communityResources, type CommunityResource } from "@/data/communityResources";
import CustomGuideSheet from "@/components/CustomGuideSheet";
import { useChatWidget } from "@/hooks/useChatWidget";

const categories = [
  { key: "all", label: "전체 분야" },
  { key: "welfare", label: "복지" },
  { key: "gov", label: "행정" },
  { key: "health", label: "의료" },
  { key: "edu", label: "교육" },
  { key: "housing", label: "주거" },
  { key: "job", label: "일자리" },
  { key: "life", label: "생활" },
];

export default function GuidePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSheetResource, setActiveSheetResource] = useState<CommunityResource | null>(null);
  const openChat = useChatWidget();

  const filteredResources = communityResources.filter((r) => {
    const matchCat = selectedCategory === "all" || r.category === selectedCategory;
    const matchText =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.plainSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="bg-background-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-6xl mx-auto w-full">
        {/* 헤더 섹션 */}
        <div className="text-center max-w-3xl mx-auto mt-4 mb-10">
          <span className="inline-block px-4 py-1.5 text-sm font-bold rounded-full bg-accent-500 text-foreground-950 mb-3">
            지역사회 자원 라이브러리
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-800 leading-tight">
            우리 지역의 도움 자원을 한눈에
          </h1>
          <p className="mt-4 text-base md:text-lg text-foreground-700 leading-relaxed">
            복지·행정·의료·교육·주거·일자리 등 검증된 공공 지원 제도를 쉬운 말로 정리했습니다.
            <br className="hidden md:inline" />
            필요한 지원을 찾고 'A4 맞춤 안내서'로 인쇄하거나 바로 AI 상담을 받아보세요.
          </p>
        </div>

        {/* 검색 및 카테고리 필터 */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-primary-200 mb-8 space-y-4">
          <div className="relative">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-foreground-400"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제도명, 지원 내용, 대상자 등을 검색해보세요 (예: 어르신 식사, 월세, 병원비)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === c.key
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-primary-50 text-primary-800 hover:bg-primary-100 border border-primary-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 자원 목록 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-primary-200 p-6 shadow-sm hover:border-primary-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-bold rounded-md bg-primary-100 text-primary-800">
                    {res.categoryLabel}
                  </span>
                  <span className="text-xs text-foreground-500 font-medium truncate max-w-[200px]">
                    🏢 {res.organization}
                  </span>
                </div>

                <h2 className="font-heading text-xl font-bold text-foreground-900 mt-1">
                  {res.title}
                </h2>

                <div className="mt-3 p-3 rounded-xl bg-primary-50/70 border border-primary-100 text-sm text-foreground-800 leading-relaxed font-medium">
                  💡 {res.plainSummary}
                </div>

                <div className="mt-4 space-y-2 text-xs md:text-sm text-foreground-700">
                  <p>
                    <strong className="text-primary-800">대상:</strong> {res.target}
                  </p>
                  <p>
                    <strong className="text-primary-800">행동 순서:</strong> {res.questions.action}
                  </p>
                  <p>
                    <strong className="text-primary-800">문의처:</strong> 📞 {res.contact}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openChat({ query: `${res.title} 신청 및 상담 방법 안내` })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 transition-colors"
                >
                  <i className="ri-chat-3-line"></i>
                  이 제도로 AI 상담
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSheetResource(res)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm"
                >
                  <i className="ri-printer-line"></i>
                  A4 맞춤 안내서 보기
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <i className="ri-search-eye-line text-4xl text-gray-400 mb-2"></i>
            <p className="text-lg font-bold text-gray-700">검색 조건에 맞는 자원이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-1">다른 검색어를 입력하시거나 카테고리를 전체로 변경해보세요.</p>
          </div>
        )}
      </main>

      <Footer />

      {activeSheetResource && (
        <CustomGuideSheet
          resource={activeSheetResource}
          onClose={() => setActiveSheetResource(null)}
        />
      )}
    </div>
  );
}
