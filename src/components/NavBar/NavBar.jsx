import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ClickedContext, CharacterContext } from "../contexts";
import { FloorInfoArray } from "../data";
import "./NavBar.css";

export default function NavBar() {
  // const [clicked, setClicked] = useContext(ClickedContext);
  const [character] = useContext(CharacterContext);
  const location = useLocation();
  // const [isMobile, setIsMobile] = useState(false);

  /* const handleScreenChange = () => {
    const currentWidth = window.innerWidth;

    if (currentWidth <= 450) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }; */

  // useEffect(() => {
  //   window.addEventListener("resize", handleScreenChange);
  //   return () => {
  //     window.removeEventListener("resize", handleScreenChange);
  //   };
  // }, [window.scrollY]); // Re-run effect if lastScrollY changes

  // const closeMobileMenu = () => {
  //   setClicked(false);
  // };

  return (
    <div className="nav-bar-container">
      <nav className="nav-bar">
        {/* <div
          className="nav-logo"
          onClick={() => {
            closeMobileMenu();
          }}
        >
        </div> */}
        {/* <header className="floor-title-container"> */}
        {character[1] < 16 ? (
          <h1 className="floor-title">
            {character[1] > 0 && location.pathname !== "/gameOverScreen"
              ? `Floor ${character[1]}`
              : character[1] > 0 && location.pathname === "/gameOverScreen"
                ? "Game Over"
                : "Darkest Depths"}
          </h1>
        ) : null}
        {/* </header> */}
        {character[1] > 0 && location.pathname !== "/gameOverScreen" ? (
          <section className="progress-bar-container">
            {FloorInfoArray.map((f, index) => (
              <div
                key={index}
                className={
                  index + 1 === character[1]
                    ? "progress-bar-segment current-floor"
                    : index + 1 != character[1] && index + 1 < character[1]
                      ? "progress-bar-segment completed-floor"
                      : "progress-bar-segment"
                }
              >
                {index + 1 === character[1] ? (
                  <span className="floor-pointer">
                    <i className="fa-solid fa-caret-down" />
                  </span>
                ) : null}
                {f != "combat-shop" ? (
                  <span
                    className={
                      f == "combat"
                        ? "header-icon combat-icon"
                        : f == "shop"
                          ? "header-icon shop-icon"
                          : f == "boss"
                            ? "header-icon bossfight-icon"
                            : ""
                    }
                  />
                ) : (
                  <span className="pre-boss-icons">
                    <span className="alt-header-icon combat-icon" /> +{" "}
                    <span className="alt-header-icon shop-icon" />
                  </span>
                )}
              </div>
            ))}
          </section>
        ) : null}
        {/* <div
          className={clicked ? "menu-icon clicked" : "menu-icon"}
          onClick={() => setClicked(!clicked)}
        >
          <i className={clicked ? "fas fa-xmark" : "fas fa-bars"} />
        </div> */}
        {/* <ul className={clicked ? "menu clicked" : "menu"}></ul> */}
      </nav>
    </div>
  );
}
