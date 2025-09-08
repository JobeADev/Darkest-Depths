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

export const Route = createFileRoute("/gameOverScreen")({
  component: GameOverScreen,
});

function GameOverScreen() {
  const { enemies } = Route.useSearch();
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
    <div className="index">
      <header className="">
        {/* <h1>you have perished!</h1> */}
        <h1 className="start-link-container">
          <Link
            to={character[1] % 15 === 0 ? "/bossBattle" : "/normalBattle"}
            search={{ prevEnemies: enemies }}
            mask={{
              to: `/floor_${character[1]}`,
            }}
            className="start-link"
          >
            retry the current floor
          </Link>
        </h1>
        <h1 className="start-link-container" onClick={handleClick}>
          <Link
            to="/normalBattle"
            mask={{
              to: "/floor_1",
            }}
            className="start-link"
          >
            start over
          </Link>
        </h1>
      </header>
      <div className=""></div>
    </div>
  );
}
