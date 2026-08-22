import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import GuidePage from "../pages/guide/page";
import CasesPage from "../pages/cases/page";
import AdminPage from "../pages/admin/page";
import DashboardPage from "../pages/dashboard/page";
import WelfareFinderPage from "../pages/welfare/page";
import EasyDocsPage from "../pages/docs/page";
import MarketPage from "../pages/market/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/welfare",
    element: <WelfareFinderPage />,
  },
  {
    path: "/docs",
    element: <EasyDocsPage />,
  },
  {
    path: "/market",
    element: <MarketPage />,
  },
  {
    path: "/guide",
    element: <GuidePage />,
  },
  {
    path: "/cases",
    element: <CasesPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

