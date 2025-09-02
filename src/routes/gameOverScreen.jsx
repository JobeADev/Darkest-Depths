import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { CharacterContext, EquipmentContext } from "../components/contexts";
import {
  StartingCharacterStats,
  StartingItems,
  StartingEquipment,
  StartingShopInventory,
} from "../components/data";

export const Route = createFileRoute("/gameOverScreen")({
  component: GameOverScreen,
});

function GameOverScreen() {
  const [, setCharacter] = useContext(CharacterContext);
  const [, setEquipment] = useContext(EquipmentContext);

  const handleClick = () => {
    setCharacter([
      StartingCharacterStats,
      1,
      StartingItems,
      StartingShopInventory,
    ]);
    setEquipment(StartingEquipment);
  };

  return (
    <div className="index">
      <header className="">
        {/* <h1>you have perished!</h1> */}
        <h1 className="start-link-container" onClick={handleClick}>
          <Link to="/normalBattle" className="start-link">
            new game
          </Link>
        </h1>
      </header>
      <div className=""></div>
    </div>
  );
}
