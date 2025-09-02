import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import {
  ClickedContext,
  CharacterContext,
  EquipmentContext,
} from "../contexts";
import {
  StartingCharacterStats,
  StartingItems,
  StartingEquipment,
  StartingShopInventory,
} from "../data";
import "./Footer.css";

export default function Footer() {
  const clicked = useContext(ClickedContext);
  const [, setCharacter] = useContext(CharacterContext);
  const [, setEquipment] = useContext(EquipmentContext);

  const handleClick = () => {
    setCharacter([
      StartingCharacterStats,
      0,
      StartingItems,
      StartingShopInventory,
    ]);
    setEquipment(StartingEquipment);
  };

  return (
    <div
      className={clicked[0] ? "footer-container clicked" : "footer-container"}
    >
      <nav className="footer">
        <div className="footer-logo" onClick={handleClick}>
          <Link to="/" className="footer-logo-text">
            home
          </Link>
        </div>
        <section className="footer-body">
          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/jobeabdellahdev/"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin" />
            </a>
            <a
              href="https://github.com/JobeADev"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-github" />
            </a>
          </div>
          <p className="copyright-tag">
            <i className="fa-regular fa-copyright" /> 2025 JobeADev
          </p>
        </section>
      </nav>
    </div>
  );
}
