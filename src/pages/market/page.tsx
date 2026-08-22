import { useState } from "react";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";

interface LocalStore {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  desc: string;
  promo: string;
  tags: string[];
}

const LOCAL_STORES: LocalStore[] = [
  {
    id: "s1",
    name: "수동 송천 두부마을",
    category: "한식 / 손두부",
    address: "경기도 남양주시 수동면 송천리 128-4",
    phone: "031-592-1142",
    desc: "매일 아침 100% 국산 콩으로 직접 가마솥에 내리는 고소한 순두부와 청국장 전문점입니다.",
    promo: "마을 어르신(65세 이상) 식사 시 1,000원 할인 및 비지 무료 나눔",
    tags: ["어르신할인", "국산콩", "남양주지역화폐"]
  },
  {
    id: "s2",
    name: "물골안 농협 로컬푸드 직매장",
    category: "지역 농산물 / 특산품",
    address: "경기도 남양주시 수동면 운수리 75-2",
    phone: "031-591-6200",
    desc: "수동면 송천리 농가에서 당일 수확한 신선한 쌈채소, 유기농 딸기, 수동 잣을 판매합니다.",
    promo: "남양주 땡큐페이 결제 시 10% 인센티브 적립",
    tags: ["친환경", "당일수확", "수동잣"]
  },
  {
    id: "s3",
    name: "송천 숲속 쉼터 카페",
    category: "카페 / 베이커리",
    address: "경기도 남양주시 수동면 송천리 45-1",
    phone: "031-594-8833",
    desc: "맑은 수동계곡 물소리를 들으며 유기농 빵과 잣 라떼를 즐길 수 있는 주민 사랑방입니다.",
    promo: "다회용 텀블러 지참 시 음료 500원 할인",
    tags: ["힐링", "주민쉼터", "반려동물동반"]
  }
];

export default function MarketPage() {
  const [storeName, setStoreName] = useState("수동 송천 잣 막걸리 주막");
  const [storeCategory, setStoreCategory] = useState("향토음식 / 전통주");
  const [storeMemo, setStoreMemo] = useState("수동 잣으로 직접 빚은 신선한 생막걸리와 파전. 주말 봄맞이 20% 특별 할인 행사");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPromoResult, setAiPromoResult] = useState<{
    intro: string;
    posterCopy: string;
    snsPost: string;
    multilingual: { en: string; vi: string; zh: string };
  } | null>(null);

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
          <h1 className="font-heading text-2xl md:text-4xl font-black text-slate-950 mt-2">
            🏪 우리 동네 가게 & AI 홍보
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            주민에게는 따뜻한 동네 가게를 소개하고, 소상공인 사장님께는 <strong>AI가 홍보 문구와 다국어 포스터를 무료로 제작</strong>해드립니다.
          </p>
        </div>

        {/* 1. 송천리·수동면 동네 가게 목록 */}
        <div className="mb-12">
          <h2 className="font-heading text-xl font-black text-slate-950 mb-4 flex items-center gap-2">
            <span>📍 송천리·수동면 추천 동네 가게</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">지역화폐 가맹점</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LOCAL_STORES.map((s) => (
              <div
                key={s.id}
                className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-amber-100 text-amber-900">
                      {s.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">📞 {s.phone}</span>
                  </div>
                  <h3 className="font-heading font-black text-lg text-slate-900">{s.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{s.address}</p>
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
