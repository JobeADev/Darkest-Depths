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
import "./index.css";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [, setCharacter] = useContext(CharacterContext);
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
      <header className="tutorial_container">
        <h2 className="tutorial_title">Controls</h2>
        <div className="tutorial_section">
          <p className="tutorial_item controls">
            <span className="click_wrapper">Left Click</span> on enemies to
            attack during your turn
          </p>
          <p className="tutorial_item controls">
            <span className="click_wrapper">Right Click</span> on enemies, or{" "}
            <span className="click_wrapper">Left Click</span> on corresponding
            Enemy Info button, for additional info
          </p>
          <p className="tutorial_item controls">
            <span className="click_wrapper">Left Click</span> on items within
            the inventory to equip them
          </p>
          <p className="tutorial_item controls">
            <span className="click_wrapper">Hover over</span> equipped items to
            see additional information about them (damage, effects, etc.)
          </p>
        </div>
        <h2 className="tutorial_title">Tips</h2>
        <div className="tutorial_section">
          <p className="tutorial_item">
            <span className="tutorial_icon poison"></span>
            <span className="debuff_wrapper">Poison</span> : At the beginning of
            every turn, where enemies are still alive, player takes hp damage
            equivalent to current poison amount. This number then decreases by
            one
          </p>
          <p className="tutorial_item">
            <span className="tutorial_icon bleed"></span>
            <span className="debuff_wrapper">Bleed</span> : At the beginning of
            every turn, where enemies are still alive, player takes hp damage
            equivalent to current bleed amount multiplied by two (2x). This
            number then decreases to 0
          </p>
          <p className="tutorial_item">
            <span className="tutorial_icon tank-shield"></span>{" "}
            <span className="debuff_wrapper">Draw-Attack</span> : While there is
            an enemy alive with this skill, there is a chance when attacking a
            different enemy that this enemy will block the attack. This skill
            has a 30% chance of triggering
          </p>
          <p className="tutorial_item">
            <span className="tutorial_icon support"></span>{" "}
            <span className="debuff_wrapper">Heal</span> : While there is an
            enemy alive with this skill, if another enemy is hurt, their hp will
            be healed by 2
          </p>
          <p className="tutorial_item">
            <span className="tutorial_icon support"></span>{" "}
            <span className="debuff_wrapper">Buff</span> : While there is an
            enemy alive with this skill, if all other enemy's hp are at the
            maximum, this skill will trigger and give a random enemy +1 to
            attack power
          </p>
        </div>
      </header>
      <div className="">
        <h1 className="start-link-container" onClick={handleClick}>
          <Link
            to="/normalBattle"
            mask={{
              to: "/floor_1",
            }}
            className="start-link"
          >
            new game
          </Link>
        </h1>
      </div>
    </div>
  );
}
