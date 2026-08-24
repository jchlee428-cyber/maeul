import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import { AVAILABLE_REGIONS, getVillageData } from "@/services/localAreaService";

export default function DashboardPage() {
  const [selectedVillageCode, setSelectedVillageCode] = useState("pyeongnae");
  const village = getVillageData(selectedVillageCode);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {/* 상단 브레드크럼 및 지역 선택기 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-extrabold text-emerald-800">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300">
                LOCAL FIRST
              </span>
              <span>대한민국 ➔ 경기도 ➔ 남양주시 ➔ 평내·호평·금곡</span>
            </div>
            <h1 className="font-heading text-[1.25rem] sm:text-2xl md:text-4xl font-black text-slate-950 mt-1 flex items-center gap-1 sm:gap-2 flex-nowrap tracking-[-0.08em] sm:tracking-normal break-keep">
              <span className="shrink-0">🏡 우리 동네 대시보드</span>
              <span className="text-emerald-700 tracking-[-0.08em] sm:tracking-normal shrink-0">[{village.name}]</span>
            </h1>
            <p className="text-sm md:text-base text-slate-600 mt-1">
              {village.fullName} 주민과 외국인을 위한 실시간 행정·복지·생활 종합 현황판입니다.
            </p>
          </div>

          {/* 지역 변경 드롭다운 */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">마을 선택:</label>
            <select
              value={selectedVillageCode}
              onChange={(e) => setSelectedVillageCode(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border-2 border-emerald-400 rounded-2xl text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              {AVAILABLE_REGIONS[0].townships[0].villages.map((v) => (
                <option key={v.code} value={v.code}>
                  📍 {v.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 1. 최상단 긴급 공지 & 핵심 정보 배너 */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-lg mb-8 border border-emerald-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black animate-pulse">
                  🔔 오늘 우리 동네 주요 공지
                </span>
                <span className="text-xs text-emerald-200">
                  행정복지센터 공식 연동
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-amber-200">
                {village.keyNotice}
              </h2>
              <p className="text-xs md:text-sm text-emerald-100">
                📍 관할: {village.representativeOrg} | 📞 전화: {village.communityCenterPhone}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black shadow-md transition-all active:scale-95"
              >
                <i className="ri-chat-voice-fill text-lg"></i>
                <span>마을지기 AI에게 질문하기</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. 8대 생활밀착 섹션 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 쓰레기 배출 요일 */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm hover:border-emerald-400 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold mb-3">
              <i className="ri-delete-bin-6-fill"></i>
            </div>
            <h3 className="font-heading font-black text-base text-slate-900">쓰레기 배출 안내</h3>
            <p className="text-xs font-bold text-emerald-800 mt-1">{village.garbageDay}</p>
            <p className="text-xs text-slate-500 mt-1">종량제 봉투 사용 필수, 재활용품 투명 봉투 배출</p>
          </div>

          {/* 대중교통 / 땡큐버스 */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm hover:border-blue-400 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl font-bold mb-3">
              <i className="ri-bus-fill"></i>
            </div>
            <h3 className="font-heading font-black text-base text-slate-900">마을 대중교통</h3>
            <p className="text-xs font-bold text-blue-800 mt-1">{village.busInfo}</p>
            <p className="text-xs text-slate-500 mt-1">실시간 버스 도착 정보는 버스정류장 QR 확인</p>
          </div>

          {/* 어르신 돌봄/의료 */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm hover:border-amber-400 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold mb-3">
              <i className="ri-heart-pulse-fill"></i>
            </div>
            <h3 className="font-heading font-black text-base text-slate-900">어르신 병원 안심동행</h3>
            <p className="text-xs font-bold text-amber-800 mt-1">병원 갈 때 동행 매니저 지원</p>
            <p className="text-xs text-slate-500 mt-1">수동면 종합행정복지센터 맞춤형복지팀 신청</p>
          </div>

          {/* 재난·안전 대피소 */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm hover:border-rose-400 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl font-bold mb-3">
              <i className="ri-shield-cross-fill"></i>
            </div>
            <h3 className="font-heading font-black text-base text-slate-900">재난·안전 및 대피소</h3>
            <p className="text-xs font-bold text-rose-800 mt-1">수동중학교 실내체육관</p>
            <p className="text-xs text-slate-500 mt-1">남양주소방서 수동119안전센터 (031-590-5340)</p>
          </div>
        </div>

        {/* 3. 주요 생활 서비스 바로가기 카드 배너 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/welfare"
            className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white/20 text-white">
              맞춤 자가진단
            </span>
            <h3 className="text-xl font-black mt-3">내가 받을 수 있는 지원</h3>
            <p className="text-xs text-blue-100 mt-1.5">
              나이, 가구형태, 거주지를 입력하면 우리 동네 지원금을 AI가 찾아드립니다.
            </p>
            <div className="mt-4 flex items-center gap-1 font-bold text-sm text-amber-300">
              <span>진단 시작하기</span>
              <i className="ri-arrow-right-line"></i>
            </div>
          </Link>

          <Link
            to="/docs"
            className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white/20 text-white">
              AI 공문서 해설
            </span>
            <h3 className="text-xl font-black mt-3">행정문서 쉽게 보기</h3>
            <p className="text-xs text-emerald-100 mt-1.5">
              어려운 행정 안내문과 공문을 복사해 넣으면 쉬운 한국어와 다국어로 요약해드립니다.
            </p>
            <div className="mt-4 flex items-center gap-1 font-bold text-sm text-amber-300">
              <span>문서 분석하기</span>
              <i className="ri-arrow-right-line"></i>
            </div>
          </Link>

          <Link
            to="/market"
            className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-700 text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white/20 text-white">
              지역 상생 & 소상공인
            </span>
            <h3 className="text-xl font-black mt-3">우리 동네 가게 & 행사</h3>
            <p className="text-xs text-amber-100 mt-1.5">
              송천리·수동면 동네 가게와 장터 행사, 상인용 AI 홍보 포스터 생성기입니다.
            </p>
            <div className="mt-4 flex items-center gap-1 font-bold text-sm text-amber-200">
              <span>동네 가게 보기</span>
              <i className="ri-arrow-right-line"></i>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
