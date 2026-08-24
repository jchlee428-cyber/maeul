import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-primary-950 text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="bg-primary-900/60 rounded-3xl px-6 py-10 md:px-12 md:py-14 text-center border border-primary-800">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
            지금, 고민을 나눠보세요
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
            공공데이터 기반 실시간 검색과 마을관리자 원스톱 연결로
            주민의 어려움을 해결해드립니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base md:text-lg font-bold rounded-full bg-accent-500 text-foreground-950 hover:bg-accent-400 transition-all shadow-lg whitespace-nowrap"
            >
              <i className="ri-chat-3-line"></i>
              무료 AI 상담 시작하기
            </Link>
            <Link
              to="/guide"
              className="inline-flex items-center gap-2.5 px-7 py-4 text-base font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors whitespace-nowrap"
            >
              <i className="ri-book-open-line"></i>
              자원 가이드 바로가기
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-6 py-4 text-base font-semibold rounded-full bg-primary-800 hover:bg-primary-700 text-accent-300 transition-colors whitespace-nowrap border border-accent-300/30"
            >
              <i className="ri-dashboard-line"></i>
              마을관리자 대시보드
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-t border-white/10 pt-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5 font-heading font-bold text-xl text-white">
              <span className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-500 text-white">
                <i className="ri-heart-3-fill"></i>
              </span>
              마을지기
            </Link>
            <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed max-w-sm">
              도움이 필요한 사람과 지역사회를 AI와 공공데이터로 연결하는 공익 솔루션. 정보 검색 ➔ 사람 연결 ➔ 문제 해결까지 함께합니다.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:text-base">
            <Link to="/guide" className="text-white/90 hover:text-accent-300 transition-colors">
              자원 가이드
            </Link>
            <Link to="/cases" className="text-white/90 hover:text-accent-300 transition-colors">
              실증 사례 & 성과
            </Link>
            <Link to="/admin" className="text-accent-300 hover:text-white font-semibold transition-colors">
              마을관리자 시스템
            </Link>
            <Link to="/guide" className="text-white/90 hover:text-accent-300 transition-colors">
              서비스 소개
            </Link>
            <Link to="/faq" className="text-white/90 hover:text-accent-300 transition-colors">
              자주 묻는 질문
            </Link>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs md:text-sm text-white/70">© {new Date().getFullYear()} 마을지기. All rights reserved.</p>
          <p className="text-xs md:text-sm text-white/70">
            긴급한 위기 시 <span className="text-accent-300 font-semibold">119 · 112</span> 등 공식 기관에 먼저 연락하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}