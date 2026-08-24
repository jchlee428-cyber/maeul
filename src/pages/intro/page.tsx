import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";

export default function IntroPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-6xl mx-auto w-full">
        {/* 히어로 배너 */}
        <div className="bg-gradient-to-br from-emerald-950 via-primary-900 to-teal-950 text-white rounded-3xl p-8 md:p-14 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-3xl relative z-10">
            <span className="inline-block px-4 py-1.5 text-xs sm:text-sm font-black rounded-full bg-amber-400 text-slate-950 mb-4 shadow-md">
              🌿 AI 기반 지역사회 생활도우미 솔루션
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              도움이 필요한 주민과 <br className="hidden sm:inline" />
              지역사회를 <span className="text-amber-300">하나로 연결</span>합니다.
            </h1>
            <p className="text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mb-8">
              <strong>마을지기(Village Keeper)</strong>는 단순한 AI 챗봇이 아닙니다. 대한민국 공식 공공데이터와 지자체 자원을 결합하여, 어르신과 취약계층 주민이 마주하는 복합적인 문제를 <strong>정보 검색 ➔ 사람 연결 ➔ 실질적 문제 해결</strong>까지 원스톱으로 지원합니다.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>💬 1:1 AI 상담 시작하기</span>
                <i className="ri-arrow-right-line"></i>
              </Link>
              <Link
                to="/faq"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm sm:text-base border border-white/20 backdrop-blur transition-all"
              >
                ❓ 자주 묻는 질문 (FAQ)
              </Link>
            </div>
          </div>
        </div>

        {/* 3대 핵심 철학 & 특징 */}
        <section className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Core Principles
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-950 mt-2">
              마을지기만의 3대 핵심 가치
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              누구나 소외되지 않고 자신의 권리를 쉽게 누릴 수 있는 지역사회를 만듭니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border-2 border-slate-200 shadow-sm hover:border-emerald-500 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mb-4">
                🏛️
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-black text-slate-950 mb-2">
                100% 공식 공공데이터 기반
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                공공데이터포털(data.go.kr), 보건복지부, 남양주시청 공식 고시를 RAG 엔진으로 실시간 대조하여 엉뚱한 거짓 답변(환각) 없는 확실한 행정·복지 정보만 제공합니다.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border-2 border-slate-200 shadow-sm hover:border-emerald-500 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mb-4">
                👴
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-black text-slate-950 mb-2">
                어르신·취약계층 눈높이 맞춤
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                어려운 행정용어를 쉬운 우리말로 풀이하는 '쉬운말 모드', 말로 묻고 귀로 듣는 음성(STT/TTS) 시스템, 원터치 전화 연결(`tel:`)로 정보 격차를 완전히 해소합니다.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border-2 border-slate-200 shadow-sm hover:border-emerald-500 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-3xl mb-4">
                🤝
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-black text-slate-950 mb-2">
                실제 사람과 기관 연결
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI 안내에 그치지 않고, 읍·면·동 행정복지센터 맞춤형복지팀, 보건소, 마을관리자에게 도움 요청을 직접 전달하여 담당 공무원의 유선·방문 지원으로 이어집니다.
              </p>
            </div>
          </div>
        </section>

        {/* 주요 5대 서비스 안내 */}
        <section className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Main Services
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-950 mt-2">
              마을지기에서 이용할 수 있는 서비스
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-xs flex items-start gap-4">
              <span className="text-3xl p-3 bg-emerald-50 rounded-2xl">💖</span>
              <div>
                <h4 className="font-black text-base sm:text-lg text-slate-950 mb-1">
                  1. 맞춤 복지 & 긴급생계 지원 RAG
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  재난적의료비, 본인부담상한제 환급, 긴급복지 생계비, 에너지바우처 등을 '신청 대상, 혜택, 구비 서류, 방문 장소' 4단계로 알기 쉽게 정리해 드립니다.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-xs flex items-start gap-4">
              <span className="text-3xl p-3 bg-emerald-50 rounded-2xl">🏛️</span>
              <div>
                <h4 className="font-black text-base sm:text-lg text-slate-950 mb-1">
                  2. 평내동 자치센터 강좌 & 남양주시청 포털
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  평내동 주민자치센터 50여 개 강좌 및 온라인 수강신청, 남양주시청 여권 발급, 대형폐기물 스티커 인터넷 신고, 통합예약포털을 즉시 검색합니다.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-xs flex items-start gap-4">
              <span className="text-3xl p-3 bg-emerald-50 rounded-2xl">🚆</span>
              <div>
                <h4 className="font-black text-base sm:text-lg text-slate-950 mb-1">
                  3. 실시간 버스 위치 & 전철 열차시간표
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  행안부/경기도 버스위치 OpenAPI로 땡큐버스·M버스를 조회하고, 서울교통공사 OpenAPI로 수도권 전철(경춘선, 8호선 별내선 등) 첫차·막차를 확인합니다.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-xs flex items-start gap-4">
              <span className="text-3xl p-3 bg-emerald-50 rounded-2xl">📄</span>
              <div>
                <h4 className="font-black text-base sm:text-lg text-slate-950 mb-1">
                  4. 행정문서 쉽게 보기 & 10개국 다국어 번역
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  복잡한 공문서를 복사해 넣으면 AI가 핵심만 요약하고, 외국인 주민을 위해 10개 언어(영어, 중국어, 베트남어, 일본어 등)로 자동 번역해 드립니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3단계 간편 이용 방법 */}
        <section className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-amber-300">
              마을지기 이용 방법 (3단계)
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              로그인이나 본인인증 없이 누구나 100% 무료로 이용할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="font-black text-base mb-1">상황 편하게 말하기</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                채팅창에 글을 쓰거나 '🎙️ 목소리로 말하기' 버튼을 눌러 평소 말투로 질문하세요.
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="font-black text-base mb-1">4단계 맞춤 안내 확인</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                공공데이터로 검증된 행동 요령(대상, 서류, 장소)과 음성 낭독을 확인합니다.
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="font-black text-base mb-1">원클릭 도움 요청 및 해결</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                '도움 요청하기'를 눌러 관할 주민센터 복지팀 및 마을관리자와 연결되세요.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-base sm:text-lg shadow-xl hover:scale-105 transition-all"
          >
            <span>🌿 지금 바로 마을지기 AI 상담 받아보기</span>
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
