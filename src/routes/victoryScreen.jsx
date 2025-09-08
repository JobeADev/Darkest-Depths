import { useState, useEffect, useContext } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CharacterContext } from "../components/contexts";
import "./victoryScreen.css";

export const Route = createFileRoute("/victoryScreen")({
  component: VictoryScreen,
});

function VictoryScreen() {
  const { gold, killCount } = Route.useSearch();
  const [character, setCharacter] = useContext(CharacterContext);
  const [goldTotal, setGoldTotal] = useState(0);

  const handleFloorChange = () => {
    if ((character[1] + 1) % 15 === 0) return character[1];
    else return character[1] + 1;
  };

  useEffect(() => {
    if (gold > 0) {
      let counter = 0;
      const interval = setInterval(() => {
        if (counter === gold) {
          clearInterval(interval);
          return;
        }
        setGoldTotal((prevTotal) => prevTotal + 1);
        counter++;
      }, 50);
      return () => clearInterval(interval);
    }
  }, []);

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
            {/* <p className="victory-screen-item">
              <span className={`item-icon ${character[2][0].class}`}></span>
              {character[2][0].name}
            </p> */}
            <h2
              className="victory-screen-link-container"
              onClick={() =>
                character[0].isFloorCompleted
                  ? setCharacter([
                      {
                        type: character[0].type,
                        hp: character[0].hp,
                        maxHp: character[0].maxHp,
                        gold: character[0].gold + gold,
                        hasRevived: character[0].hasRevived,
                        isFloorCompleted: false,
                      },
                      handleFloorChange(),
                      character[2],
                      character[3],
                      {
                        totalGold: character[4].totalGold + gold,
                        totalKills: character[4].totalKills + killCount,
                      },
                    ])
                  : setCharacter([
                      {
                        type: character[0].type,
                        hp: character[0].hp,
                        maxHp: character[0].maxHp,
                        gold: character[0].gold,
                        hasRevived: character[0].hasRevived,
                        isFloorCompleted: false,
                      },
                      character[1],
                      character[2],
                      character[3],
                    ])
              }
            >
              <Link
                to={
                  (character[1] + 1) % 16 === 0
                    ? "/gameCompletion"
                    : (character[1] + 1) % 5 === 0
                      ? "/shop"
                      : "/normalBattle"
                }
                mask={
                  (character[1] + 1) % 16 === 0
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
                {(character[1] + 1) % 16 === 0
                  ? "completion screen"
                  : (character[1] + 1) % 5 === 0
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
