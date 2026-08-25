import { useState } from "react";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";

interface LocalStore {
  id: string;
  name: string;
  category: string;
  categoryGroup: "food" | "market" | "life" | "health";
  address: string;
  phone: string;
  desc: string;
  promo: string;
  tags: string[];
}

const LOCAL_STORES: LocalStore[] = [
  {
    id: "s1",
    name: "평내 장터 손칼국수 & 보리밥",
    category: "한식 / 전통면",
    categoryGroup: "food",
    address: "경기도 남양주시 평내로 29번길 14",
    phone: "031-591-3320",
    desc: "매일 직접 반죽한 쫄깃한 손칼국수와 구수한 보리밥 정식을 정직한 가격에 대접하는 평내동 대표 맛집입니다.",
    promo: "마을 어르신(65세 이상) 및 다문화가정 1,000원 할인",
    tags: ["착한가격", "어르신우대", "남양주사랑상품권"]
  },
  {
    id: "s2",
    name: "호평 늘을마을 친환경 로컬마켓 & 반찬",
    category: "친환경 로컬푸드",
    categoryGroup: "market",
    address: "경기도 남양주시 호평로 46번길 8",
    phone: "031-592-8811",
    desc: "남양주 관내 농가에서 당일 수확한 신선한 무농약 쌈채소와 유기농 과일, 정갈한 저염 어르신 맞춤 밑반찬을 직거래 판매합니다.",
    promo: "남양주 땡큐페이 결제 시 10% 추가 적립",
    tags: ["당일수확", "친환경", "평내호평역인근", "저염반찬"]
  },
  {
    id: "s3",
    name: "금곡 홍유릉 쉼터 베이커리 카페",
    category: "카페 / 디저트",
    categoryGroup: "food",
    address: "경기도 남양주시 금곡동 홍유릉로 248",
    phone: "031-593-7740",
    desc: "역사 깊은 홍유릉 산책로 입구에서 갓 구운 천연발효 빵과 스페셜티 커피를 즐길 수 있는 주민 쉼터입니다.",
    promo: "텀블러 지참 시 전 음료 500원 할인",
    tags: ["홍유릉산책", "천연발효", "주민사랑방"]
  },
  {
    id: "s4",
    name: "평내 늘푸른 약국 (공공심야약국)",
    category: "약국 / 건강상담",
    categoryGroup: "health",
    address: "경기도 남양주시 경춘로 1256 (평내동)",
    phone: "031-591-1190",
    desc: "밤 10시까지 불을 밝히는 공공심야약국으로, 어르신 복약지도와 혈압·당뇨 자가관리 상담을 무료로 도와드립니다.",
    promo: "어르신 맞춤 복약수첩 및 비타민 무료 증정",
    tags: ["공공심야약국", "복약상담", "남양주사랑상품권"]
  },
  {
    id: "s5",
    name: "금곡 명품 세탁 & 옷수선 클리닝",
    category: "생활편의 / 세탁수선",
    categoryGroup: "life",
    address: "경기도 남양주시 금곡로 78번길 5",
    phone: "031-592-4411",
    desc: "30년 장인 정신으로 아끼는 옷을 꼼꼼하게 복원 세탁하고 수선해 드립니다. 거동이 불편하신 독거 어르신 댁은 무료 수거·배달을 지원합니다.",
    promo: "65세 이상 독거 어르신 의류·이불 무료 수거배달",
    tags: ["무료수거배달", "장인세탁", "착한이웃가게"]
  }
];

const CATEGORY_TABS = [
  { key: "all", label: "전체 보기", icon: "🏬" },
  { key: "food", label: "착한 식당 & 카페", icon: "🍲" },
  { key: "market", label: "로컬푸드 & 반찬", icon: "🥬" },
  { key: "life", label: "생활편의 & 세탁", icon: "🧺" },
  { key: "health", label: "약국 & 동네의원", icon: "💊" }
];

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [storeName, setStoreName] = useState("평내 메인프라자 도토리마을");
  const [storeCategory, setStoreCategory] = useState("한식 / 묵요리 전문점");
  const [storeMemo, setStoreMemo] = useState("100% 국산 도토리로 직접 쑨 도토리묵밥과 바삭한 해물파전. 봄맞이 주민 감사 15% 할인 행사");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPromoResult, setAiPromoResult] = useState<{
    intro: string;
    posterCopy: string;
    snsPost: string;
    multilingual: { en: string; vi: string; zh: string };
  } | null>(null);

  const filteredStores = selectedCategory === "all"
    ? LOCAL_STORES
    : LOCAL_STORES.filter(s => s.categoryGroup === selectedCategory);

  const handleGeneratePromo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setAiPromoResult({
        intro: `안녕하세요! 맑고 깨끗한 남양주시 수동면 송천리의 명물, [${storeName}]입니다. 우리 땅에서 정성껏 자란 수동 잣의 깊은 풍미를 그대로 담아 정직하게 대접합니다.`,
        posterCopy: `🌲 "수동 잣의 진한 고소함이 한 잔에 쏙!"\n봄맞이 우리 동네 이웃 특별 감사 20% 할인 대축제! 이번 주말, 송천리에서 만나요!`,
        snsPost: `[#남양주맛집 #수동면송천리] 봄바람 살랑이는 날, 맑은 수동계곡에서 즐기는 진한 잣 막걸리와 바삭한 파전 한 상! 🍶🌸\n\n📌 위치: 남양주시 수동면 송천리\n🎁 혜택: 마을지기 보고 오셨다고 말씀하시면 음료수 1병 서비스!\n\n#우리동네가게 #마을지기AI #수동면맛집`,
        multilingual: {
          en: `Welcome to [${storeName}] in Songcheon-ri! Enjoy freshly brewed local pine-nut drinks and traditional dishes made with 100% natural ingredients. Spring special 20% discount now!`,
          vi: `Chào mừng bạn đến với [${storeName}] tại làng Songcheon-ri! Thưởng thức các món ăn truyền thống và đồ uống đặc sản hạt thông thơm ngon. Giảm giá đặc biệt 20% cho mùa xuân!`,
          zh: `欢迎光临松川里 [${storeName}]！品尝用纯天然当地松子精心酿造的传统饮品与特色美食。春季邻里感恩回馈20%特惠中！`
        }
      });
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-6xl mx-auto w-full">
        {/* 상단 타이틀 */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="px-3.5 py-1 text-xs font-black rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            LOCAL BUSINESS & COMMUNITY
          </span>
          <h1 className="font-heading text-xl sm:text-2xl md:text-4xl font-black text-slate-950 mt-2 tracking-[-0.08em] sm:tracking-normal break-keep">
            🏪 우리 동네 가게 & AI 홍보
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2 break-keep">
            주민에게는 따뜻한 동네 가게를 소개하고, 소상공인 사장님께는 <strong>AI가 홍보 문구와 다국어 포스터를 무료로 제작</strong>해드립니다.
          </p>
        </div>

        {/* 1. 평내·호평·금곡 동네 가게 목록 */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-heading text-lg sm:text-xl font-black text-slate-950 flex flex-wrap items-center gap-2 tracking-[-0.05em] sm:tracking-normal break-keep">
              <span>📍 평내·호평·금곡 추천 동네 가게</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">지역화폐 가맹점</span>
            </h2>
          </div>

          {/* 🌟 1번 반영: 업종별 빠른 필터 탭 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all active:scale-95 ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400"
                      : "bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredStores.map((s) => (
              <div
                key={s.id}
                className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-amber-100 text-amber-900">
                      {s.category}
                    </span>
                    <a
                      href={`tel:${s.phone.replace(/[^0-9]/g, "")}`}
                      className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300 font-bold font-mono inline-flex items-center gap-1 active:scale-95 transition-transform"
                      title="전화 걸기"
                    >
                      <span>📞</span>
                      <span>{s.phone}</span>
                    </a>
                  </div>
                  <h3 className="font-heading font-black text-lg text-slate-900">{s.name}</h3>
                  
                  {/* 🌟 2번 반영: 지도 길찾기 연동 버튼 */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-slate-500 truncate">{s.address}</p>
                    <a
                      href={`https://map.naver.com/v5/search/${encodeURIComponent(s.address + " " + s.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1 transition-colors"
                      title="네이버 지도에서 길찾기 열기"
                    >
                      <span>📍</span>
                      <span>길찾기</span>
                    </a>
                  </div>

                  <p className="text-xs md:text-sm text-slate-700 mt-3 leading-relaxed">{s.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-950">
                    🎁 <strong>혜택:</strong> {s.promo}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* 2. 소상공인 상인용 AI 홍보 생성기 (핵심 차별화 기능) */}
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="border-b-2 border-slate-100 pb-4 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
              AI 소상공인 도우미
            </span>
            <h2 className="font-heading text-xl md:text-2xl font-black text-slate-950 mt-1">
              ✨ 사장님을 위한 1초 AI 홍보 콘텐츠 제작기
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              가게 이름과 간단한 행사 메모만 적으시면, AI가 <strong>소개글, 포스터 문구, SNS 게시글, 외국인용 다국어 번역</strong>까지 한 번에 만들어드립니다.
            </p>
          </div>

          <form onSubmit={handleGeneratePromo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">가게 상호명</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl text-sm font-black focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">업종 / 대표 메뉴</label>
                <input
                  type="text"
                  value={storeCategory}
                  onChange={(e) => setStoreCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl text-sm font-black focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">홍보하고 싶은 내용 / 할인 행사 메모</label>
              <textarea
                value={storeMemo}
                onChange={(e) => setStoreMemo(e.target.value)}
                rows={3}
                className="w-full p-3 bg-slate-50 border-2 border-slate-300 rounded-2xl text-sm font-medium focus:border-amber-500 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all active:scale-98"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  AI가 홍보 콘텐츠 작성 중...
                </>
              ) : (
                <>
                  <i className="ri-sparkling-fill text-lg"></i>
                  <span>AI 무료 홍보 콘텐츠 생성하기</span>
                </>
              )}
            </button>
          </form>

          {/* AI 홍보 생성 결과 */}
          {aiPromoResult && (
            <div className="mt-8 pt-6 border-t-2 border-slate-100 space-y-4">
              <h3 className="font-heading font-black text-lg text-emerald-900 flex items-center gap-1.5">
                <i className="ri-checkbox-circle-fill text-emerald-600"></i>
                AI가 완성한 맞춤 홍보 콘텐츠
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300">
                  <strong className="text-amber-950 block mb-1 font-extrabold">📢 포스터 / 현수막 홍보 문구:</strong>
                  <p className="text-slate-900 font-bold whitespace-pre-line leading-relaxed">{aiPromoResult.posterCopy}</p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300">
                  <strong className="text-emerald-950 block mb-1 font-extrabold">📱 SNS / 당근마켓 홍보글:</strong>
                  <p className="text-slate-900 font-bold whitespace-pre-line leading-relaxed">{aiPromoResult.snsPost}</p>
                </div>
              </div>

              {/* 외국인 손님용 3개국 다국어 홍보문 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                <strong className="text-slate-950 block mb-2 font-extrabold">🌏 외국인 주민 및 관광객용 다국어 안내문:</strong>
                <div className="space-y-2 text-xs text-slate-800 font-medium">
                  <div><strong>🇺🇸 English:</strong> {aiPromoResult.multilingual.en}</div>
                  <div><strong>🇻🇳 Tiếng Việt:</strong> {aiPromoResult.multilingual.vi}</div>
                  <div><strong>🇨🇳 中文:</strong> {aiPromoResult.multilingual.zh}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
