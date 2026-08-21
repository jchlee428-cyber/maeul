import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background-50 flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-4xl mb-6 shadow-inner">
        <i className="ri-compass-3-line"></i>
      </div>

      <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-800">
        길을 찾지 못했어요
      </h1>
      <p className="mt-3 text-base md:text-lg text-foreground-700 max-w-md">
        요청하신 페이지(<code>{location.pathname}</code>)가 존재하지 않거나 이동되었습니다.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-base font-bold rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm"
        >
          <i className="ri-home-4-line"></i>
          마을지기 홈으로
        </Link>
        <Link
          to="/guide"
          className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full bg-white border border-primary-300 text-primary-800 hover:bg-primary-50 transition-colors"
        >
          <i className="ri-book-open-line"></i>
          자원 가이드 보기
        </Link>
      </div>

      <p className="mt-12 text-xs text-foreground-500">
        마을지기 | 도움이 필요한 사람과 지역사회를 AI로 연결합니다.
      </p>
    </div>
  );
}