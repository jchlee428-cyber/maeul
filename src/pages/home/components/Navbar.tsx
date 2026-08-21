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
        <div className="hidden lg:flex items-center gap-1">
          {isHome ? (
            <>
              <a
                href="#intro"
                className={`px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${
                  scrolled ? "text-foreground-800 hover:bg-primary-50" : "text-white/90 hover:bg-white/10"
                }`}
              >
                서비스 소개
              </a>
              <a
                href="#how"
                className={`px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${
                  scrolled ? "text-foreground-800 hover:bg-primary-50" : "text-white/90 hover:bg-white/10"
                }`}
              >
                이용 방법
              </a>
              <a
                href="#categories"
                className={`px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${
                  scrolled ? "text-foreground-800 hover:bg-primary-50" : "text-white/90 hover:bg-white/10"
                }`}
              >
                지원 분야
              </a>
            </>
          ) : (
            <Link
              to="/"
              className="px-3.5 py-2 text-sm font-medium rounded-full text-foreground-800 hover:bg-primary-50"
            >
              홈
            </Link>
          )}

          <Link
            to="/guide"
            className={`px-3.5 py-2 text-sm font-semibold rounded-full transition-colors ${
              location.pathname === "/guide"
                ? "bg-primary-100 text-primary-800 font-bold"
                : scrolled || !isHome
                ? "text-foreground-800 hover:bg-primary-50"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            자원 가이드
          </Link>

          <Link
            to="/cases"
            className={`px-3.5 py-2 text-sm font-semibold rounded-full transition-colors ${
              location.pathname === "/cases"
                ? "bg-primary-100 text-primary-800 font-bold"
                : scrolled || !isHome
                ? "text-foreground-800 hover:bg-primary-50"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            실증 사례
          </Link>

          <Link
            to="/admin"
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
              location.pathname === "/admin"
                ? "bg-accent-500 text-foreground-950 shadow-sm"
                : scrolled || !isHome
                ? "bg-primary-50 text-primary-800 hover:bg-primary-100 border border-primary-200"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <i className="ri-dashboard-line"></i>
            마을관리자 대시보드
          </Link>
        </div>

        {/* 우측 도구: 상담 시작 버튼 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openChat()}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm md:text-base font-bold rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-all shadow hover:shadow-md whitespace-nowrap"
          >
            <i className="ri-chat-3-line"></i>
            상담 시작
          </button>

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
          {isHome ? (
            <>
              <a
                href="#intro"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-foreground-900 rounded-lg hover:bg-primary-50"
              >
                서비스 소개
              </a>
              <a
                href="#how"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-foreground-900 rounded-lg hover:bg-primary-50"
              >
                이용 방법
              </a>
              <a
                href="#categories"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-foreground-900 rounded-lg hover:bg-primary-50"
              >
                지원 분야
              </a>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-foreground-900 rounded-lg hover:bg-primary-50"
            >
              마을지기 홈
            </Link>
          )}

          <Link
            to="/guide"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 text-sm font-semibold text-primary-800 rounded-lg hover:bg-primary-50"
          >
            자원 가이드 (8대 분야)
          </Link>

          <Link
            to="/cases"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 text-sm font-semibold text-primary-800 rounded-lg hover:bg-primary-50"
          >
            실증 사례 및 성과
          </Link>

          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 text-sm font-bold text-accent-700 bg-accent-50 rounded-lg"
          >
            <i className="ri-dashboard-line mr-1"></i>
            AI 마을관리자 대시보드 (/admin)
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openChat();
            }}
            className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-full bg-primary-600 text-white shadow"
          >
            <i className="ri-chat-3-line"></i>
            무료 AI 상담 시작
          </button>
        </div>
      )}
    </header>
  );
}