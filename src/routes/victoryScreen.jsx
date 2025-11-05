import { useState, useEffect, useContext } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CharacterContext } from "../components/contexts";
import { DroppableItems } from "../components/data";
import "./victoryScreen.css";

export const Route = createFileRoute("/victoryScreen")({
  component: VictoryScreen,
});

function VictoryScreen() {
  const { gold, killCount } = Route.useSearch();
  const [character, setCharacter] = useContext(CharacterContext);
  const [goldTotal, setGoldTotal] = useState(0);
  // const [equipmentDrops, setEquipmentDrops] = useState([]);
  const [consumableDrops, setConsumableDrops] = useState([]);

  const handleFloorChange = () => {
    if ((character[1] + 1) % 15 === 0) return character[1];
    else return character[1] + 1;
  };

  useEffect(() => {
    let interval;
    if (gold > 0) {
      let counter = 0;
      interval = setInterval(() => {
        if (counter === gold) {
          clearInterval(interval);
          return;
        }
        setGoldTotal((prevTotal) => prevTotal + 1);
        counter++;
      }, 50);
    }
    // const equipmentDropped = [];
    const consumablesDropped = new Map();
    if (character[1] > 4) {
      for (let i = 0; i < killCount; i++) {
        const chanceNum = Math.floor(Math.random() * 100);
        if (chanceNum < DroppableItems[0].dropRate) {
          if (consumablesDropped.get(DroppableItems[0])) {
            consumablesDropped.set(
              DroppableItems[0],
              consumablesDropped.get(DroppableItems[0]) + 1,
            );
          } else consumablesDropped.set(DroppableItems[0], 1);
        }
      }
    }
    // setEquipmentDrops(equipmentDropped)
    setConsumableDrops(consumablesDropped);
    return () => clearInterval(interval);
  }, []);

  const createNewInventory = () => {
    consumableDrops.forEach((value, key) => {
      const index = character[2].findIndex((i) => i.name === key.name);
      if (index > -1) {
        character[2][index] = {
          name: character[2][index].name,
          type: "Consumable",
          element: character[2][index].element,
          effect: character[2][index].effect,
          quantity: character[2][index].quantity + value,
          dropRate: character[2][index].dropRate,
          class: character[2][index].class,
        };
      } else
        character[2].push({
          name: key.name,
          type: "Consumable",
          element: key.element,
          effect: key.effect,
          quantity: value,
          dropRate: key.dropRate,
          class: key.class,
        });
    });
    return character[2];
  };

  return (
    <div className="stage-container">
      <div className="stage">
        <div className="victory-screen-blur">
          <div className="victory-screen-sheet">
            <p className="kill-counter">
              enemies slain: <span className="kill-num">{killCount}</span>
            </p>
            <h1 className="victory-screen-title">
              {gold > 0 ? "victory !" : "escaped !"}
            </h1>
            <p className="victory-screen-gold-earned">
              +
              <span className="victory-screen-gold-earned-number">
                <span className="gold-icon gold-bag" />
                {goldTotal}
              </span>
            </p>
            {Array.from(consumableDrops.entries()).map(([key, value]) => (
              <p className="victory-screen-item" key={key.name}>
                <b className="font-change">x</b>
                {value}
                <span className={`item-icon ${key.class}`}></span>
                {key.name}
              </p>
            ))}
            <h2
              className="victory-screen-link-container"
              onClick={() =>
                character[0].isFloorCompleted &&
                (character[1] % 14 === 0 || (character[1] + 1) % 5 === 0)
                  ? setCharacter([
                      {
                        type: character[0].type,
                        hp: character[0].hp,
                        maxHp: character[0].maxHp,
                        gold: character[0].gold + gold,
                        hasRevived: character[0].hasRevived,
                        isFloorCompleted: false,
                        isShopNext: true,
                      },
                      handleFloorChange(),
                      createNewInventory(),
                      character[3],
                      {
                        totalGold: character[4].totalGold + gold,
                        totalKills: character[4].totalKills + killCount,
                      },
                    ])
                  : character[0].isFloorCompleted
                    ? setCharacter([
                        {
                          type: character[0].type,
                          hp: character[0].hp,
                          maxHp: character[0].maxHp,
                          gold: character[0].gold + gold,
                          hasRevived: character[0].hasRevived,
                          isFloorCompleted: false,
                          isShopNext: character[0].isShopNext,
                        },
                        handleFloorChange(),
                        createNewInventory(),
                        character[3],
                        {
                          totalGold: character[4].totalGold + gold,
                          totalKills: character[4].totalKills + killCount,
                        },
                      ])
                    : setCharacter([
                        character[0],
                        character[1],
                        character[2],
                        character[3],
                        character[4],
                      ])
              }
            >
              <Link
                to={
                  (character[1] + 1) % 16 === 0 || character[1] % 16 === 0
                    ? "/gameCompletion"
                    : (character[1] + 1) % 5 === 0 || character[1] % 5 === 0
                      ? "/shop"
                      : "/normalBattle"
                }
                mask={
                  (character[1] + 1) % 16 === 0 || character[1] % 16 === 0
                    ? {
                        to: "/game_complete",
                      }
                    : (character[1] + 1) % 15 === 0
                      ? {
                          to: `/floor_${character[1]}`,
                        }
                      : {
                          to: `/floor_${character[1] + 1}`,
                        }
                }
                className="victory-screen-link"
              >
                {(character[1] + 1) % 16 === 0 || character[1] % 16 === 0
                  ? "completion screen"
                  : (character[1] + 1) % 5 === 0 || character[1] % 5 === 0
                    ? "go to shop"
                    : "next floor"}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
