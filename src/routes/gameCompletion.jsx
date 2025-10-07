import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { CharacterContext, EquipmentContext } from "../components/contexts";
import {
  StartingCharacterStats,
  StartingStatTotals,
  StartingItems,
  StartingEquipment,
  StartingShopInventory,
} from "../components/data";
import "./gameCompletion.css";

export const Route = createFileRoute("/gameCompletion")({
  component: GameCompletion,
});

function GameCompletion() {
  const [character, setCharacter] = useContext(CharacterContext);
  const [, setEquipment] = useContext(EquipmentContext);

  const handleClick = () => {
    setCharacter([
      StartingCharacterStats,
      1,
      StartingItems,
      StartingShopInventory,
      StartingStatTotals,
    ]);
    setEquipment(StartingEquipment);
  };

  return (
    <div className="game-completion-container">
      <header className="game-completion-header">
        <h1>you have defeated the Necromancer and finished the game!</h1>
      </header>
      <div className="completion-screen-sheet-container">
        <div className="completion-screen-sheet">
          <h1 className="victory-screen-title">game stats</h1>
          <section className="stat-section">
            <p className="stat-title">inventory:</p>
            <section className="stat-section-inventory">
              {character[2].map((i, index) => (
                <div key={index} className={`inventory-item ${i.class}`}>
                  {/* <p className="active-item-name">{i.name}</p> */}
                </div>
              ))}
            </section>
          </section>
          <section className="stat-section">
            <p className="stat-title">
              total gold earned:{" "}
              <span className="victory-screen-gold-earned-number">
                <span className="completion-gold-icon gold-bag" />
                {character[4].totalGold}
              </span>
            </p>
          </section>
          <section className="stat-section">
            <p className="stat-title">
              total enemies killed:{" "}
              <span className="kill-num">{character[4].totalKills}</span>
            </p>
          </section>
        </div>
      </div>
      <h2 className="start-link-container" onClick={handleClick}>
        <Link
          to="/normalBattle"
          mask={{
            to: "/floor_1",
          }}
          className="completion-screen-link"
        >
          start over?
        </Link>
      </h2>
      <div className=""></div>
    </div>
  );
}
