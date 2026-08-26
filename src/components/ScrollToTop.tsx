import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 페이지 이동(Route Change) 시 브라우저 스크롤을 항상 최상단(Top)으로 자동 이동시키는 컴포넌트
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, [pathname, hash]);

  return null;
}
