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
        <div className="hidden lg:flex items-center gap-1.5">
          {/* [🏠 홈] 예쁜 집 모양 단독 아이콘 버튼 */}
          <Link
            to="/cases"
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              location.pathname === "/cases"
                ? "bg-primary-800 text-accent-300 shadow-md ring-2 ring-accent-400/40"
                : "text-primary-800 hover:bg-primary-100 hover:text-primary-950"
            }`}
            title="홈 (실증 성과 보고서)"
          >
            <i className="ri-home-4-fill text-xl"></i>
          </Link>

          <Link
            to="/"
            className={`px-4 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-1.5 ${
              location.pathname === "/"
                ? "bg-primary-800 text-accent-300 shadow-sm"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-chat-voice-fill text-emerald-600"></i>
            <span>1:1 AI 상담창</span>
          </Link>

          <Link
            to="/guide"
            className={`px-3.5 py-2 text-sm font-semibold rounded-full transition-colors ${
              location.pathname === "/guide"
                ? "bg-primary-100 text-primary-800 font-bold"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            자원 가이드
          </Link>

          <Link
            to="/admin"
            className={`px-3.5 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-1 ${
              location.pathname === "/admin"
                ? "bg-primary-800 text-white font-bold shadow-sm"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-shield-user-line"></i>
            <span>관제 대시보드</span>
          </Link>
        </div>

        {/* 우측 CTA: 1:1 상담 바로가기 버튼 */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <i className="ri-chat-smile-2-fill text-base"></i>
            <span>AI 무료 상담하기</span>
          </Link>
        </div>

        {/* 우측 도구: 상담 시작 버튼 */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden w-9 h-9 flex items-center justify-center rounded-full ${
              scrolled || !isHome
                ? "text-primary-900 bg-primary-50"
                : "text-white bg-white/20"
            }`}
            aria-label="메뉴 열기"
          >
            <i className={`text-lg ${open ? "ri-close-line" : "ri-menu-line"}`}></i>
          </button>
        </div>
      </nav>

      {/* 모바일 드로어 */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-1 shadow-lg max-h-[80vh] overflow-y-auto">
          <Link
            to="/cases"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-xl flex items-center gap-2 ${
              location.pathname === "/cases"
                ? "bg-primary-800 text-accent-300"
                : "text-foreground-900 hover:bg-primary-50"
            }`}
          >
            <i className="ri-home-4-fill text-accent-500 text-lg"></i>
            <span>실증 성과 보고 (홈)</span>
          </Link>

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-xl flex items-center gap-2 ${
              location.pathname === "/"
                ? "bg-primary-800 text-accent-300"
                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
            }`}
          >
            <i className="ri-chat-voice-fill text-emerald-600 text-lg"></i>
            <span>1:1 AI 대화형 상담창</span>
          </Link>

          <Link
            to="/guide"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-semibold rounded-xl flex items-center gap-2 ${
              location.pathname === "/guide"
                ? "bg-primary-100 text-primary-800 font-bold"
                : "text-foreground-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-book-read-line text-primary-600 text-lg"></i>
            <span>자원 가이드 (8대 분야)</span>
          </Link>

          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className={`px-4 py-3 text-sm font-bold rounded-xl flex items-center gap-2 ${
              location.pathname === "/admin"
                ? "bg-primary-800 text-white"
                : "text-primary-800 hover:bg-primary-50"
            }`}
          >
            <i className="ri-shield-user-line text-primary-600 text-lg"></i>
            <span>마을관리자 관제 대시보드</span>
          </Link>

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
          >
            <i className="ri-chat-smile-2-fill text-base"></i>
            <span>1:1 AI 무료 상담 바로가기</span>
          </Link>
        </div>
      )}
    </header>
  );
}