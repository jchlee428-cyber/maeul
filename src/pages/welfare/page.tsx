import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";

interface BenefitItem {
  id: string;
  name: string;
  category: string;
  whyMatched: string;
  eligibility: string;
  benefit: string;
  amount: string;
  period: string;
  method: string;
  contact: string;
  source: string;
}

export default function WelfareFinderPage() {
  const [age, setAge] = useState("72");
  const [household, setHousehold] = useState("senior_single"); // senior_single, low_income, single_parent, multicultural, general
  const [children, setChildren] = useState("0");
  const [employed, setEmployed] = useState("no");
  const [hasDiagnosed, setHasDiagnosed] = useState(false);

  const sampleResults: BenefitItem[] = [
    {
      id: "b1",
      name: "어르신 기초연금 및 병원비 본인부담상한제 환급",
      category: "노인 복지 / 의료비",
      whyMatched: "만 65세 이상 독거 어르신 조건에 부합합니다.",
      eligibility: "만 65세 이상, 소득인정액 기준 하위 70% 가구",
      benefit: "월 최대 334,810원 기초연금 지급 및 연간 본인부담상한 초과 병원비 100% 환급",
      amount: "월 최대 334,810원 (기초연금 기준)",
      period: "연중 수시 접수",
      method: "평내동 종합행정복지센터 방문 또는 복지로(bokjiro.go.kr) 온라인 신청",
      contact: "보건복지상담센터 📞 129 / 평내동 복지팀 📞 031-590-2605",
      source: "보건복지부 / 국민건강보험공단 (2026년 최신 기준)"
    },
    {
      id: "b2",
      name: "남양주시 독거어르신 인공지능(AI) 돌봄로봇 및 안심동행",
      category: "지자체 맞춤 돌봄",
      whyMatched: "남양주시 평내동 거주 1인 독거 가구 특화 사업입니다.",
      eligibility: "남양주시 관내 65세 이상 독거 및 만성질환 어르신",
      benefit: "24시간 AI 돌봄인형 지급, 응급상황 119 자동 호출, 병원 방문 시 동행 매니저 파견",
      amount: "전액 무료 (남양주시 전액 지원)",
      period: "매월 선착순 접수",
      method: "통장님 또는 평내동 행정복지센터 맞춤형복지팀 유선 신청",
      contact: "남양주시 노인복지과 📞 031-590-4411 / 평내동 📞 031-590-2605",
      source: "남양주시청 노인복지과 공고 (2026-03)"
    },
    {
      id: "b3",
      name: "에너지바우처 및 동절기 난방비 특별지원",
      category: "에너지 / 생활안정",
      whyMatched: "고령 독거 가구의 계절별 에너지 비용 경감 대상입니다.",
      eligibility: "기초수급 또는 차상위 계층 중 노인·영유아·장애인 포함 가구",
      benefit: "전기·도시가스·연탄·LPG 구매 이용권(바우처) 차감 지급",
      amount: "가구당 연간 평균 약 347,000원 상당 지원",
      period: "매년 5월 ~ 12월",
      method: "주민센터 방문 신청 또는 복지로",
      contact: "한국에너지공단 📞 1600-0736",
      source: "산업통상자원부 / 한국에너지공단"
    }
  ];

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    setHasDiagnosed(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-5xl mx-auto w-full">
        {/* 상단 타이틀 */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="px-3.5 py-1 text-xs font-black rounded-full bg-blue-100 text-blue-900 border border-blue-300">
            WHAT CAN I GET?
          </span>
          <h1 className="font-heading text-2xl md:text-4xl font-black text-slate-950 mt-2">
            🎯 내가 받을 수 있는 지원
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            기본적인 몇 가지 정보만 알려주시면, 우리 동네와 국가에서 제공하는 꼭 맞는 복지혜택을 AI가 한눈에 찾아드립니다.
          </p>
        </div>

        {/* 법적 필수 면책 고지 배너 */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs md:text-sm font-bold flex items-start gap-3 mb-8 shadow-xs">
          <i className="ri-information-fill text-amber-600 text-lg shrink-0 mt-0.5"></i>
          <div>
            <strong>안내사항 (필독):</strong> 본 진단 결과는 공공데이터 기반 <strong>AI 사전 안내</strong>이며, 법적인 공식 지원자격 확정 판정이 아닙니다. 정확한 수급 자격은 관할 행정복지센터(031-590-2601)나 보건복지상담센터(129)에서 최종 심사 후 결정됩니다.
          </div>
        </div>

        {/* 진단 입력 폼 카드 */}
        <form onSubmit={handleDiagnose} className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-md mb-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. 나이 */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">만 나이</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl font-black text-base focus:border-blue-600 focus:outline-none"
                placeholder="예: 72"
                required
              />
            </div>

            {/* 2. 가구 형태 */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">가구 형태</label>
              <select
                value={household}
                onChange={(e) => setHousehold(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl font-black text-sm focus:border-blue-600 focus:outline-none"
              >
                <option value="senior_single">👴 1인 독거 어르신</option>
                <option value="low_income">🌾 기초수급·차상위 가구</option>
                <option value="single_parent">👨‍👧 한부모·조손 가정</option>
                <option value="multicultural">🌏 다문화·외국인 가정</option>
                <option value="general">🏡 일반 다인가구</option>
              </select>
            </div>

            {/* 3. 미성년 자녀 수 */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">함께 사는 자녀 수</label>
              <select
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl font-black text-sm focus:border-blue-600 focus:outline-none"
              >
                <option value="0">0명 (없음)</option>
                <option value="1">1명</option>
                <option value="2">2명</option>
                <option value="3">3명 이상 (다자녀)</option>
              </select>
            </div>

            {/* 4. 취업 상태 */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">현재 근로 상태</label>
              <select
                value={employed}
                onChange={(e) => setEmployed(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl font-black text-sm focus:border-blue-600 focus:outline-none"
              >
                <option value="no">무직 / 은퇴 / 소득 없음</option>
                <option value="temporary">일용직 / 특수고용 / 프리랜서</option>
                <option value="yes">정규직 / 안정적 소득 있음</option>
                <option value="business">소상공인 / 자영업자</option>
              </select>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white font-black text-base rounded-2xl shadow-lg transition-all transform active:scale-98 w-full sm:w-auto"
            >
              <i className="ri-search-eye-line text-xl"></i>
              <span>내가 받을 수 있는 지원금 검색하기</span>
            </button>
          </div>
        </form>

        {/* 진단 결과 목록 */}
        {hasDiagnosed && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl md:text-2xl font-black text-slate-900">
                ✨ 주민님께 해당될 가능성이 높은 지원사업 (총 {sampleResults.length}건)
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                남양주시 평내동 기준 매칭
              </span>
            </div>

            <div className="space-y-4">
              {sampleResults.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 w-fit">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      🏛️ 출처: {item.source}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-black text-slate-950">
                    {item.name}
                  </h3>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs md:text-sm text-emerald-950 font-bold">
                    💡 <strong>추천 이유:</strong> {item.whyMatched}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-800">
                    <div>
                      <strong>👤 지원 대상:</strong> {item.eligibility}
                    </div>
                    <div>
                      <strong>🎁 지원 혜택:</strong> <span className="text-blue-700 font-bold">{item.amount}</span>
                    </div>
                    <div>
                      <strong>📅 신청 기간:</strong> {item.period}
                    </div>
                    <div>
                      <strong>📝 신청 방법:</strong> {item.method}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-600">
                      {item.contact}
                    </span>
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs md:text-sm font-black shadow transition-colors"
                    >
                      <i className="ri-chat-smile-2-fill"></i>
                      <span>이 지원사업 AI와 1:1 상담하기</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
