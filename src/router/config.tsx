import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";

// 코드 스플리팅: 필요할 때만 가볍게 동적 로딩
const GuidePage = lazy(() => import("../pages/guide/page"));
const CasesPage = lazy(() => import("../pages/cases/page"));
const AdminPage = lazy(() => import("../pages/admin/page"));
const DashboardPage = lazy(() => import("../pages/dashboard/page"));
const WelfareFinderPage = lazy(() => import("../pages/welfare/page"));
const EasyDocsPage = lazy(() => import("../pages/docs/page"));
const MarketPage = lazy(() => import("../pages/market/page"));

function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></span>
        <span className="text-xs font-black text-emerald-900">우리 동네 정보를 불러오는 중입니다...</span>
      </div>
    </div>
  );
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    ),
  },
  {
    path: "/welfare",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WelfareFinderPage />
      </Suspense>
    ),
  },
  {
    path: "/docs",
    element: (
      <Suspense fallback={<PageLoader />}>
        <EasyDocsPage />
      </Suspense>
    ),
  },
  {
    path: "/market",
    element: (
      <Suspense fallback={<PageLoader />}>
        <MarketPage />
      </Suspense>
    ),
  },
  {
    path: "/guide",
    element: (
      <Suspense fallback={<PageLoader />}>
        <GuidePage />
      </Suspense>
    ),
  },
  {
    path: "/cases",
    element: (
      <Suspense fallback={<PageLoader />}>
        <CasesPage />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
