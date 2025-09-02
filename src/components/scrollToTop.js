import { useEffect, useContext } from "react";
import { useLocation } from "@tanstack/react-router";
import { ClickedContext } from "./contexts";

export default function ScrollToTop() {
  const [, setClicked] = useContext(ClickedContext);
  const location = useLocation();

  const handleClicked = () => {
    setClicked(false);
  };

  useEffect(() => {
    // Scroll to top on route change
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    handleClicked();
  }, [location]);

  return null;
}
