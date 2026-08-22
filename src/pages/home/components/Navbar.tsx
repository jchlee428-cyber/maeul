import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useChatWidget } from "@/hooks/useChatWidget";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openChat = useChatWidget();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur border-b border-primary-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-4 md:px-6 h-16 md:h-20 max-w-7xl mx-auto">
        <Link
          to="/"
          className={`flex items-center gap-2.5 font-heading font-bold text-xl md:text-2xl ${
            scrolled || !isHome ? "text-primary-900" : "text-white"
          }`}
        >
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-600 text-white shadow">
            <i className="ri-heart-3-fill"></i>
          </span>
          마을지기
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden xl:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-1.5 ${
              location.pathname === "/"
                ? "bg-primary-800 text-accent-300 shadow-sm"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-chat-voice-fill text-emerald-600"></i>
            <span>1:1 AI 상담</span>
          </Link>

          <Link
            to="/dashboard"
            className={`px-3 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-1 ${
              location.pathname === "/dashboard"
                ? "bg-primary-800 text-accent-300 shadow-sm"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-dashboard-3-line text-emerald-700"></i>
            <span>동네 대시보드</span>
          </Link>

          <Link
            to="/welfare"
            className={`px-3 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-1 ${
              location.pathname === "/welfare"
                ? "bg-primary-800 text-accent-300 shadow-sm"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-hand-heart-line text-blue-600"></i>
            <span>맞춤 지원</span>
          </Link>

          <Link
            to="/docs"
            className={`px-3 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-1 ${
              location.pathname === "/docs"
                ? "bg-primary-800 text-accent-300 shadow-sm"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-file-text-line text-emerald-600"></i>
            <span>공문서 해설</span>
          </Link>

          <Link
            to="/market"
            className={`px-3 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-1 ${
              location.pathname === "/market"
                ? "bg-primary-800 text-accent-300 shadow-sm"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-store-2-line text-amber-600"></i>
            <span>동네 가게</span>
          </Link>

          <Link
            to="/guide"
            className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors ${
              location.pathname === "/guide"
                ? "bg-primary-100 text-primary-800 font-bold"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            자원 가이드
          </Link>

          <Link
            to="/cases"
            className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-1 ${
              location.pathname === "/cases"
                ? "bg-primary-100 text-primary-800 font-bold"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-verified-badge-line text-emerald-600"></i>
            <span>실증 성과</span>
          </Link>

          <Link
            to="/admin"
            className={`px-3 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-1 ${
              location.pathname === "/admin"
                ? "bg-primary-800 text-white font-bold shadow-sm"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-shield-user-line"></i>
            <span>관제</span>
          </Link>
        </div>

        {/* 우측 CTA */}
        <div className="hidden xl:flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <i className="ri-chat-smile-2-fill"></i>
            <span>AI 무료 상담</span>
          </Link>
        </div>

        {/* 모바일 햄버거 메뉴 버튼 */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-emerald-800 text-white shadow"
            aria-label="메뉴 열기"
          >
            <i className={`text-xl ${open ? "ri-close-line" : "ri-menu-line"}`}></i>
          </button>
        </div>
      </nav>

      {/* 모바일 드로어 (10대 메뉴) */}
      {open && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-4 flex flex-col gap-1.5 shadow-2xl max-h-[85vh] overflow-y-auto">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-black rounded-2xl flex items-center gap-2.5 ${
              location.pathname === "/" ? "bg-emerald-900 text-amber-300 shadow" : "text-emerald-900 bg-emerald-50"
            }`}
          >
            <i className="ri-chat-voice-fill text-lg text-emerald-600"></i>
            <span>1:1 AI 대화형 상담창 (홈)</span>
          </Link>

          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-2.5 ${
              location.pathname === "/dashboard" ? "bg-emerald-900 text-white" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <i className="ri-dashboard-3-fill text-lg text-emerald-700"></i>
            <span>우리 동네 실시간 대시보드</span>
          </Link>

          <Link
            to="/welfare"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-2.5 ${
              location.pathname === "/welfare" ? "bg-blue-900 text-white" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <i className="ri-hand-heart-fill text-lg text-blue-600"></i>
            <span>내가 받을 수 있는 지원 자가진단</span>
          </Link>

          <Link
            to="/docs"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-2.5 ${
              location.pathname === "/docs" ? "bg-emerald-900 text-white" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <i className="ri-file-text-fill text-lg text-emerald-600"></i>
            <span>행정문서 쉽게 보기 (AI 해설)</span>
          </Link>

          <Link
            to="/market"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-2.5 ${
              location.pathname === "/market" ? "bg-amber-900 text-white" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <i className="ri-store-2-fill text-lg text-amber-600"></i>
            <span>우리 동네 가게 & AI 홍보</span>
          </Link>

          <Link
            to="/guide"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-2.5 ${
              location.pathname === "/guide" ? "bg-slate-900 text-white" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <i className="ri-book-read-fill text-lg text-slate-600"></i>
            <span>자원 가이드 (8대 공공분야)</span>
          </Link>

          <Link
            to="/cases"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-2.5 ${
              location.pathname === "/cases" ? "bg-emerald-900 text-white" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <i className="ri-verified-badge-fill text-lg text-emerald-600"></i>
            <span>실증 성과 및 출처 검증</span>
          </Link>

          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-2xl flex items-center gap-2.5 ${
              location.pathname === "/admin" ? "bg-primary-900 text-white" : "text-slate-800 hover:bg-slate-100"
            }`}
          >
            <i className="ri-shield-user-fill text-lg text-slate-700"></i>
            <span>AI 마을관리자 관제 대시보드</span>
          </Link>
        </div>
      )}
    </header>
  );
}