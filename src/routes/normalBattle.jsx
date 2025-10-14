import { useState, useEffect, useContext, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CharacterContext, EquipmentContext } from "../components/contexts";
import Player from "../components/BattleComponents/Player";
import Enemy from "../components/BattleComponents/Enemy";
import Loader from "../components/Loader";
import {
  EnemiesList,
  EncounterAmounts,
  EnemyPositions,
} from "../components/data";
import "./normalBattle.css";

export const Route = createFileRoute("/normalBattle")({
  component: NormalBattle,
});

const getRandomObject = (array) => {
  const randomObject = array[Math.floor(Math.random() * array.length)];
  return randomObject;
};

function NormalBattle() {
  const navigate = useNavigate();
  const { prevEnemies } = Route.useSearch();
  const [character, setCharacter] = useContext(CharacterContext);
  const [equipment, setEquipment] = useContext(EquipmentContext);
  const encounterAmount = useRef(getRandomObject(EncounterAmounts));
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningAway, setIsRunningAway] = useState(false);
  const [hoveredEnemy, setHoveredEnemy] = useState({});
  const [enemiesArray, setEnemiesArray] = useState([]);
  const [isPlayersTurn, setIsPlayersTurn] = useState(true);
  const [canAct, setCanAct] = useState(true);
  const [isPlayerAttacking, setIsPlayerAttacking] = useState([
    false,
    false,
    false,
  ]);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState([
    false,
    false,
    false,
  ]);
  const [isEnemySupporting, setIsEnemySupporting] = useState(false);
  const [playerHP, setPlayerHP] = useState(character[0].hp);
  const [enemyHP, setEnemyHP] = useState([0, 0, 0]);
  const [poisonDamage, setPoisonDamage] = useState(0);
  const [bleedDamage, setBleedDamage] = useState(0);
  const enemyTurnOrder = useRef(null);
  const areEnemiesTanks = useRef(null);
  const enemyBuffedDamage = useRef([0, 0, 0]);
  const goldDropped = useRef(0);
  const enemiesKilled = useRef(0);
  const [hasPlayerRevived, setHasPlayerRevived] = useState(
    character[0].hasRevived,
  );
  const runFailPercent = 24; // this represents 25% to fail, 75% chance for success
  const tankFailPercent = 6; // this represents 70% to fail, 30% chance for success
  const poisonFailPercent = 6; // this represents 70% to fail, 30% chance for success
  const bleedFailPercent = 6; // this represents 70% to fail, 30% chance for success

  const getEnemiesList = (num) => {
    if (character[1] <= 4) {
      if (num == 0)
        return EnemiesList.filter(
          (enemy) => enemy.floors.includes("early") && enemy.type === "Human",
        );
      else
        return EnemiesList.filter(
          (enemy) => enemy.floors.includes("early") && enemy.type !== "Human",
        );
    } else if (character[1] >= 6 && character[1] <= 9) {
      if (num == 0)
        return EnemiesList.filter(
          (enemy) => enemy.floors.includes("mid") && enemy.type === "Human",
        );
      else
        return EnemiesList.filter(
          (enemy) => enemy.floors.includes("mid") && enemy.type !== "Human",
        );
    } else {
      if (num == 0)
        return EnemiesList.filter(
          (enemy) => enemy.floors.includes("late") && enemy.type === "Human",
        );
      else
        return EnemiesList.filter(
          (enemy) => enemy.floors.includes("late") && enemy.type !== "Human",
        );
    }
  };

  const getEnemiesListWithoutSupport = (num) => {
    if (character[1] <= 4) {
      if (num == 0)
        return EnemiesList.filter(
          (enemy) =>
            enemy.floors.includes("early") &&
            enemy.type === "Human" &&
            enemy.combatStyle !== "support",
        );
      else
        return EnemiesList.filter(
          (enemy) =>
            enemy.floors.includes("early") &&
            enemy.type !== "Human" &&
            enemy.combatStyle !== "support",
        );
    } else if (character[1] >= 6 && character[1] <= 9) {
      if (num == 0)
        return EnemiesList.filter(
          (enemy) =>
            enemy.floors.includes("mid") &&
            enemy.type === "Human" &&
            enemy.combatStyle !== "support",
        );
      else
        return EnemiesList.filter(
          (enemy) =>
            enemy.floors.includes("mid") &&
            enemy.type !== "Human" &&
            enemy.combatStyle !== "support",
        );
    } else {
      if (num == 0)
        return EnemiesList.filter(
          (enemy) =>
            enemy.floors.includes("late") &&
            enemy.type === "Human" &&
            enemy.combatStyle !== "support",
        );
      else
        return EnemiesList.filter(
          (enemy) =>
            enemy.floors.includes("late") &&
            enemy.type !== "Human" &&
            enemy.combatStyle !== "support",
        );
    }
  };

  useEffect(() => {
    let initialEnemies;
    if (!prevEnemies) {
      let hasSupport = false;
      const isHuman = Math.floor(Math.random() * 4);
      initialEnemies = [];
      const enemiesList = getEnemiesList(isHuman);
      const enemiesListWithoutSupport = getEnemiesListWithoutSupport(isHuman);
      for (let i = 0; i < encounterAmount.current; i++) {
        if (encounterAmount.current === 3) {
          if (hasSupport) {
            initialEnemies.push(getRandomObject(enemiesListWithoutSupport));
          } else {
            initialEnemies.push(getRandomObject(enemiesList));
            if (initialEnemies[i].combatStyle === "support") {
              hasSupport = true;
            }
          }
        } else {
          initialEnemies.push(getRandomObject(enemiesListWithoutSupport));
        }
      }
      setEnemiesArray(initialEnemies);
    } else {
      encounterAmount.current = prevEnemies.length;
      initialEnemies = prevEnemies;
      setEnemiesArray(initialEnemies);
    }
    const turnOrder =
      encounterAmount.current < 3
        ? [
            {
              speed: initialEnemies[0].speed,
              index: 0,
            },
            {
              speed: initialEnemies[1].speed,
              index: 1,
            },
            {
              speed: 0,
              index: 2,
            },
          ].sort((a, b) => b.speed - a.speed)
        : [
            {
              speed: initialEnemies[0].speed,
              index: 0,
            },
            {
              speed: initialEnemies[1].speed,
              index: 1,
            },
            {
              speed: initialEnemies[2].speed,
              index: 2,
            },
          ].sort((a, b) => b.speed - a.speed);
    enemyTurnOrder.current = [
      turnOrder[0].index,
      turnOrder[1].index,
      turnOrder[2].index,
    ];
    if (encounterAmount.current < 3) {
      areEnemiesTanks.current = [
        initialEnemies[0].combatStyle === "tank",
        initialEnemies[1].combatStyle === "tank",
        false,
      ];
      setEnemyHP([initialEnemies[0].hp, initialEnemies[1].hp, enemyHP[2]]);
    } else {
      areEnemiesTanks.current = [
        initialEnemies[0].combatStyle === "tank",
        initialEnemies[1].combatStyle === "tank",
        initialEnemies[2].combatStyle === "tank",
      ];
      setEnemyHP([
        initialEnemies[0].hp,
        initialEnemies[1].hp,
        initialEnemies[2].hp,
      ]);
    }
    setIsLoading(false);
  }, []);

  const setEnemyAttacked = (number) => {
    if (number === 1) {
      setIsPlayerAttacking([true, false, false]);
    }
    if (number === 2) {
      setIsPlayerAttacking([false, true, false]);
    }
    if (number === 3) {
      setIsPlayerAttacking([false, false, true]);
    }
  };

  const resetEnemyAttacked = () => {
    setIsPlayerAttacking([false, false, false]);
  };

  const handleRunAwayCheck = () => {
    const num = Math.floor(Math.random() * 100);

    if (num > runFailPercent) {
      setIsRunningAway(true);
      return true;
    } else {
      return false;
    }
  };

  const findLivingEnemies = (enemyCurrentHP, firstLivingEnemyNum) => {
    if (
      enemyCurrentHP[enemyTurnOrder.current[0]] > 0 &&
      firstLivingEnemyNum != enemyTurnOrder.current[0]
    ) {
      return enemyTurnOrder.current[0];
    } else if (
      enemyCurrentHP[enemyTurnOrder.current[1]] > 0 &&
      firstLivingEnemyNum != enemyTurnOrder.current[1]
    ) {
      return enemyTurnOrder.current[1];
    } else {
      return enemyTurnOrder.current[2];
    }
  };

  const findDeadEnemies = (enemyCurrentHP, firstDeadEnemyNum) => {
    if (
      enemyCurrentHP[enemyTurnOrder.current[0]] <= 0 &&
      firstDeadEnemyNum != enemyTurnOrder.current[0]
    ) {
      return enemyTurnOrder.current[0];
    } else if (
      enemyCurrentHP[enemyTurnOrder.current[1]] <= 0 &&
      firstDeadEnemyNum != enemyTurnOrder.current[1]
    ) {
      return enemyTurnOrder.current[1];
    } else {
      return enemyTurnOrder.current[2];
    }
  };

  const setEnemyAttacking = (num) => {
    if (num === 0) {
      setIsEnemyAttacking([true, false, false]);
    } else if (num === 1) {
      setIsEnemyAttacking([false, true, false]);
    } else {
      setIsEnemyAttacking([false, false, true]);
    }
  };

  const handleHeal = (num, enemyCurrentHP) => {
    if (num === 1) {
      const sortedArrayOfEnemyHP = [
        {
          index: enemyTurnOrder.current[0],
          hp:
            enemyCurrentHP[enemyTurnOrder.current[0]] +
            enemiesArray[enemyTurnOrder.current[2]].heal,
        },
        {
          index: enemyTurnOrder.current[1],
          hp: enemyCurrentHP[enemyTurnOrder.current[1]],
        },
        {
          index: enemyTurnOrder.current[2],
          hp: enemyCurrentHP[enemyTurnOrder.current[2]],
        },
      ].sort((a, b) => a.index - b.index);
      setEnemyHP([
        sortedArrayOfEnemyHP[0].hp,
        sortedArrayOfEnemyHP[1].hp,
        sortedArrayOfEnemyHP[2].hp,
      ]);
    } else {
      const sortedArrayOfEnemyHP = [
        {
          index: enemyTurnOrder.current[0],
          hp: enemyCurrentHP[enemyTurnOrder.current[0]],
        },
        {
          index: enemyTurnOrder.current[1],
          hp:
            enemyCurrentHP[enemyTurnOrder.current[1]] +
            enemiesArray[enemyTurnOrder.current[2]].heal,
        },
        {
          index: enemyTurnOrder.current[2],
          hp: enemyCurrentHP[enemyTurnOrder.current[2]],
        },
      ].sort((a, b) => a.index - b.index);
      setEnemyHP([
        sortedArrayOfEnemyHP[0].hp,
        sortedArrayOfEnemyHP[1].hp,
        sortedArrayOfEnemyHP[2].hp,
      ]);
    }
  };

  const handleBuff = (num) => {
    if (num === 1) {
      const sortedArrayOfEnemyHP = [
        {
          index: enemyTurnOrder.current[0],
          buff:
            enemyBuffedDamage.current[enemyTurnOrder.current[0]] +
            enemiesArray[enemyTurnOrder.current[2]].buff,
        },
        {
          index: enemyTurnOrder.current[1],
          buff: enemyBuffedDamage.current[enemyTurnOrder.current[1]],
        },
        {
          index: enemyTurnOrder.current[2],
          buff: enemyBuffedDamage.current[enemyTurnOrder.current[2]],
        },
      ].sort((a, b) => a.index - b.index);
      enemyBuffedDamage.current = [
        sortedArrayOfEnemyHP[0].buff,
        sortedArrayOfEnemyHP[1].buff,
        sortedArrayOfEnemyHP[2].buff,
      ];
    } else {
      const sortedArrayOfEnemyHP = [
        {
          index: enemyTurnOrder.current[0],
          buff: enemyBuffedDamage.current[enemyTurnOrder.current[0]],
        },
        {
          index: enemyTurnOrder.current[1],
          buff:
            enemyBuffedDamage.current[enemyTurnOrder.current[1]] +
            enemiesArray[enemyTurnOrder.current[2]].buff,
        },
        {
          index: enemyTurnOrder.current[2],
          buff: enemyBuffedDamage.current[enemyTurnOrder.current[2]],
        },
      ].sort((a, b) => a.index - b.index);
      enemyBuffedDamage.current = [
        sortedArrayOfEnemyHP[0].buff,
        sortedArrayOfEnemyHP[1].buff,
        sortedArrayOfEnemyHP[2].buff,
      ];
    }
  };

  const handlePlayerAttack = (enemyCurrentHP, number, enemyWeakness) => {
    let strongAgainst = 0;
    let isGuarded = false;
    const guardRoll = Math.floor(Math.random() * 10);
    if (enemyWeakness === equipment[0].element) {
      strongAgainst = equipment[0].damage;
    }
    if (number === 1 && enemyCurrentHP[0] > 0) {
      if (guardRoll > tankFailPercent) {
        if (areEnemiesTanks.current[1] && enemyCurrentHP[1] > 0) {
          isGuarded = true;
          if (enemiesArray[1].weakness != equipment[0].element)
            strongAgainst = 0;
          else strongAgainst = equipment[0].damage;
          if (enemyCurrentHP[1] - (equipment[0].damage + strongAgainst) > 0) {
            enemyCurrentHP = [
              enemyCurrentHP[0],
              enemyCurrentHP[1] - (equipment[0].damage + strongAgainst),
              enemyCurrentHP[2],
            ];
          } else {
            enemyCurrentHP = [enemyCurrentHP[0], 0, enemyCurrentHP[2]];
            goldDropped.current = goldDropped.current + enemiesArray[1].gold;
            enemiesKilled.current = enemiesKilled.current + 1;
          }
          setEnemyHP([enemyHP[0], enemyCurrentHP[1], enemyHP[2]]);
          number = 2;
        } else if (areEnemiesTanks.current[2] && enemyCurrentHP[2] > 0) {
          isGuarded = true;
          if (enemiesArray[2].weakness != equipment[0].element)
            strongAgainst = 0;
          else strongAgainst = equipment[0].damage;
          if (enemyCurrentHP[2] - (equipment[0].damage + strongAgainst) > 0) {
            enemyCurrentHP = [
              enemyCurrentHP[0],
              enemyCurrentHP[1],
              enemyCurrentHP[2] - (equipment[0].damage + strongAgainst),
            ];
          } else {
            enemyCurrentHP = [enemyCurrentHP[0], enemyCurrentHP[1], 0];
            goldDropped.current = goldDropped.current + enemiesArray[2].gold;
            enemiesKilled.current = enemiesKilled.current + 1;
          }
          setEnemyHP([enemyHP[0], enemyHP[1], enemyCurrentHP[2]]);
          number = 3;
        }
      }
      if (!isGuarded) {
        if (enemyCurrentHP[0] - (equipment[0].damage + strongAgainst) > 0) {
          enemyCurrentHP = [
            enemyCurrentHP[0] - (equipment[0].damage + strongAgainst),
            enemyCurrentHP[1],
            enemyCurrentHP[2],
          ];
        } else {
          enemyCurrentHP = [0, enemyCurrentHP[1], enemyCurrentHP[2]];
          goldDropped.current = goldDropped.current + enemiesArray[0].gold;
          enemiesKilled.current = enemiesKilled.current + 1;
        }
        setEnemyHP([enemyCurrentHP[0], enemyHP[1], enemyHP[2]]);
      }
    } else if (number === 2 && enemyCurrentHP[1] > 0) {
      if (guardRoll > tankFailPercent) {
        if (areEnemiesTanks.current[0] && enemyCurrentHP[0] > 0) {
          isGuarded = true;
          if (enemiesArray[0].weakness != equipment[0].element)
            strongAgainst = 0;
          else strongAgainst = equipment[0].damage;
          if (enemyCurrentHP[0] - (equipment[0].damage + strongAgainst) > 0) {
            enemyCurrentHP = [
              enemyCurrentHP[0] - (equipment[0].damage + strongAgainst),
              enemyCurrentHP[1],
              enemyCurrentHP[2],
            ];
          } else {
            enemyCurrentHP = [0, enemyCurrentHP[1], enemyCurrentHP[2]];
            goldDropped.current = goldDropped.current + enemiesArray[0].gold;
            enemiesKilled.current = enemiesKilled.current + 1;
          }
          setEnemyHP([enemyCurrentHP[0], enemyHP[1], enemyHP[2]]);
          number = 1;
        } else if (areEnemiesTanks.current[2] && enemyCurrentHP[2] > 0) {
          isGuarded = true;
          if (enemiesArray[2].weakness != equipment[0].element)
            strongAgainst = 0;
          else strongAgainst = equipment[0].damage;
          if (enemyCurrentHP[2] - (equipment[0].damage + strongAgainst) > 0) {
            enemyCurrentHP = [
              enemyCurrentHP[0],
              enemyCurrentHP[1],
              enemyCurrentHP[2] - (equipment[0].damage + strongAgainst),
            ];
          } else {
            enemyCurrentHP = [enemyCurrentHP[0], enemyCurrentHP[1], 0];
            goldDropped.current = goldDropped.current + enemiesArray[2].gold;
            enemiesKilled.current = enemiesKilled.current + 1;
          }
          setEnemyHP([enemyHP[0], enemyHP[1], enemyCurrentHP[2]]);
          number = 3;
        }
      }
      if (!isGuarded) {
        if (enemyCurrentHP[1] - (equipment[0].damage + strongAgainst) > 0) {
          enemyCurrentHP = [
            enemyCurrentHP[0],
            enemyCurrentHP[1] - (equipment[0].damage + strongAgainst),
            enemyCurrentHP[2],
          ];
        } else if (!isGuarded) {
          enemyCurrentHP = [enemyCurrentHP[0], 0, enemyCurrentHP[2]];
          goldDropped.current = goldDropped.current + enemiesArray[1].gold;
          enemiesKilled.current = enemiesKilled.current + 1;
        }
        setEnemyHP([enemyHP[0], enemyCurrentHP[1], enemyHP[2]]);
      }
    } else if (number === 3 && enemyCurrentHP[2] > 0) {
      if (guardRoll > tankFailPercent) {
        if (areEnemiesTanks.current[0] && enemyCurrentHP[0] > 0) {
          isGuarded = true;
          if (enemiesArray[0].weakness != equipment[0].element)
            strongAgainst = 0;
          else strongAgainst = equipment[0].damage;
          if (enemyCurrentHP[0] - (equipment[0].damage + strongAgainst) > 0) {
            enemyCurrentHP = [
              enemyCurrentHP[0] - (equipment[0].damage + strongAgainst),
              enemyCurrentHP[1],
              enemyCurrentHP[2],
            ];
          } else {
            enemyCurrentHP = [0, enemyCurrentHP[1], enemyCurrentHP[2]];
            goldDropped.current = goldDropped.current + enemiesArray[0].gold;
            enemiesKilled.current = enemiesKilled.current + 1;
          }
          setEnemyHP([enemyCurrentHP[0], enemyHP[1], enemyHP[2]]);
          number = 1;
        } else if (areEnemiesTanks.current[1] && enemyCurrentHP[1] > 0) {
          isGuarded = true;
          if (enemiesArray[1].weakness != equipment[0].element)
            strongAgainst = 0;
          else strongAgainst = equipment[0].damage;
          if (enemyCurrentHP[1] - (equipment[0].damage + strongAgainst) > 0) {
            enemyCurrentHP = [
              enemyCurrentHP[0],
              enemyCurrentHP[1] - (equipment[0].damage + strongAgainst),
              enemyCurrentHP[2],
            ];
          } else {
            enemyCurrentHP = [enemyCurrentHP[0], 0, enemyCurrentHP[2]];
            goldDropped.current = goldDropped.current + enemiesArray[1].gold;
            enemiesKilled.current = enemiesKilled.current + 1;
          }
          setEnemyHP([enemyHP[0], enemyCurrentHP[1], enemyHP[2]]);
          number = 2;
        }
      }
      if (!isGuarded) {
        if (enemyCurrentHP[2] - (equipment[0].damage + strongAgainst) > 0) {
          enemyCurrentHP = [
            enemyCurrentHP[0],
            enemyCurrentHP[1],
            enemyCurrentHP[2] - (equipment[0].damage + strongAgainst),
          ];
        } else if (!isGuarded) {
          enemyCurrentHP = [enemyCurrentHP[0], enemyCurrentHP[1], 0];
          goldDropped.current = goldDropped.current + enemiesArray[2].gold;
          enemiesKilled.current = enemiesKilled.current + 1;
        }
        setEnemyHP([enemyHP[0], enemyHP[1], enemyCurrentHP[2]]);
      }
    }
    setEnemyAttacked(number);
    return enemyCurrentHP;
  };

  const handleEnemyAttacks = (
    playerCurrentHP,
    enemyCurrentHP,
    canRevive,
    hasRevived,
  ) => {
    let notFirst = false;
    let notSecond = false;
    let hasDied = false;

    if (
      enemyCurrentHP[0] > 0 &&
      enemyCurrentHP[1] > 0 &&
      enemyCurrentHP[2] > 0
    ) {
      setTimeout(() => {
        if (!hasRevived) {
          if (
            enemiesArray[enemyTurnOrder.current[0]].combatStyle ===
              "attacker" ||
            enemiesArray[enemyTurnOrder.current[0]].combatStyle === "tank"
          ) {
            setEnemyAttacking(enemyTurnOrder.current[0]);
            playerCurrentHP =
              playerCurrentHP -
              (enemiesArray[enemyTurnOrder.current[0]].damage +
                enemyBuffedDamage.current[enemyTurnOrder.current[0]]);
            if (playerCurrentHP <= 0) {
              if (canRevive) {
                hasRevived = true;
                const revivalHp = Math.round(character[0].maxHp * 0.3);
                playerCurrentHP = revivalHp;
                setPlayerHP(revivalHp);
                setEquipment([equipment[0], {}]);
                const filteredInventory = character[2].filter(
                  (i) => i.name != "Revival Pendant",
                );
                setCharacter([character[0], character[1], filteredInventory]);
                canRevive = false;
                setHasPlayerRevived(true);
              } else {
                setPlayerHP(0);
              }
            } else {
              if (
                enemiesArray[enemyTurnOrder.current[0]].class.includes("spider")
              ) {
                const poisonRoll = Math.floor(Math.random() * 10);
                if (poisonRoll > poisonFailPercent)
                  setPoisonDamage((previousPoisonNum) => previousPoisonNum + 1);
              }
              if (enemiesArray[enemyTurnOrder.current[0]].skill === "Bleed") {
                const bleedRoll = Math.floor(Math.random() * 10);
                if (bleedRoll > bleedFailPercent)
                  setBleedDamage((previousBleedNum) => previousBleedNum + 1);
              }
              setPlayerHP(
                (previousHP) =>
                  previousHP -
                  (enemiesArray[enemyTurnOrder.current[0]].damage +
                    enemyBuffedDamage.current[enemyTurnOrder.current[0]]),
              );
            }
          }
        }
      }, 500),
        setTimeout(() => {
          if (
            enemiesArray[enemyTurnOrder.current[0]].combatStyle ===
              "attacker" ||
            enemiesArray[enemyTurnOrder.current[0]].combatStyle === "tank"
          ) {
            resetEnemyAttacking();
          }
          if (hasRevived) {
            setIsPlayersTurn(true);
            setCanAct(true);
            hasDied = true;
          }
        }, 1400),
        setTimeout(() => {
          if (playerCurrentHP > 0 && !hasRevived) {
            if (
              enemiesArray[enemyTurnOrder.current[1]].combatStyle ===
                "attacker" ||
              enemiesArray[enemyTurnOrder.current[1]].combatStyle === "tank"
            ) {
              setEnemyAttacking(enemyTurnOrder.current[1]);
              playerCurrentHP =
                playerCurrentHP -
                (enemiesArray[enemyTurnOrder.current[1]].damage +
                  enemyBuffedDamage.current[enemyTurnOrder.current[1]]);
              if (playerCurrentHP <= 0) {
                if (canRevive) {
                  hasRevived = true;
                  const revivalHp = Math.round(character[0].maxHp * 0.3);
                  playerCurrentHP = revivalHp;
                  setPlayerHP(revivalHp);
                  setEquipment([equipment[0], {}]);
                  const filteredInventory = character[2].filter(
                    (i) => i.name != "Revival Pendant",
                  );
                  setCharacter([character[0], character[1], filteredInventory]);
                  canRevive = false;
                  setHasPlayerRevived(true);
                } else {
                  notFirst = true;
                  setPlayerHP(0);
                }
              } else {
                if (
                  enemiesArray[enemyTurnOrder.current[1]].class.includes(
                    "spider",
                  )
                ) {
                  const poisonRoll = Math.floor(Math.random() * 10);
                  if (poisonRoll > poisonFailPercent)
                    setPoisonDamage(
                      (previousPoisonNum) => previousPoisonNum + 1,
                    );
                }
                if (enemiesArray[enemyTurnOrder.current[1]].skill === "Bleed") {
                  const bleedRoll = Math.floor(Math.random() * 10);
                  if (bleedRoll > bleedFailPercent)
                    setBleedDamage((previousBleedNum) => previousBleedNum + 1);
                }
                setPlayerHP(
                  (previousHP) =>
                    previousHP -
                    (enemiesArray[enemyTurnOrder.current[1]].damage +
                      enemyBuffedDamage.current[enemyTurnOrder.current[1]]),
                );
              }
            }
          }
        }, 2000),
        setTimeout(() => {
          if (
            enemiesArray[enemyTurnOrder.current[1]].combatStyle ===
              "attacker" ||
            enemiesArray[enemyTurnOrder.current[1]].combatStyle === "tank"
          ) {
            resetEnemyAttacking();
          }
          if (hasRevived && !hasDied) {
            setIsPlayersTurn(true);
            setCanAct(true);
            hasDied = true;
          }
        }, 2900),
        setTimeout(() => {
          if (playerCurrentHP <= 0 && !notFirst) {
            hasDied = true;
            navigate({
              to: "/gameOverScreen",
              search: {
                enemies: enemiesArray,
              },
              mask: {
                to: "/game_over",
              },
            });
          }
          if (playerCurrentHP > 0 && !hasRevived) {
            if (
              enemiesArray[enemyTurnOrder.current[2]].combatStyle ===
                "attacker" ||
              enemiesArray[enemyTurnOrder.current[2]].combatStyle === "tank"
            ) {
              setEnemyAttacking(enemyTurnOrder.current[2]);
              playerCurrentHP =
                playerCurrentHP -
                (enemiesArray[enemyTurnOrder.current[2]].damage +
                  enemyBuffedDamage.current[enemyTurnOrder.current[2]]);
              if (playerCurrentHP <= 0) {
                if (canRevive) {
                  const revivalHp = Math.round(character[0].maxHp * 0.3);
                  playerCurrentHP = revivalHp;
                  setPlayerHP(revivalHp);
                  setEquipment([equipment[0], {}]);
                  const filteredInventory = character[2].filter(
                    (i) => i.name != "Revival Pendant",
                  );
                  setCharacter([character[0], character[1], filteredInventory]);
                  canRevive = false;
                  setHasPlayerRevived(true);
                } else {
                  notSecond = true;
                  setPlayerHP(0);
                }
              } else {
                if (
                  enemiesArray[enemyTurnOrder.current[2]].class.includes(
                    "spider",
                  )
                ) {
                  const poisonRoll = Math.floor(Math.random() * 10);
                  if (poisonRoll > poisonFailPercent)
                    setPoisonDamage(
                      (previousPoisonNum) => previousPoisonNum + 1,
                    );
                }
                if (enemiesArray[enemyTurnOrder.current[2]].skill === "Bleed") {
                  const bleedRoll = Math.floor(Math.random() * 10);
                  if (bleedRoll > bleedFailPercent)
                    setBleedDamage((previousBleedNum) => previousBleedNum + 1);
                }
                setPlayerHP(
                  (previousHP) =>
                    previousHP -
                    (enemiesArray[enemyTurnOrder.current[2]].damage +
                      enemyBuffedDamage.current[enemyTurnOrder.current[2]]),
                );
              }
            } else if (
              enemiesArray[enemyTurnOrder.current[2]].combatStyle === "support"
            ) {
              if (
                enemyCurrentHP[enemyTurnOrder.current[0]] <
                  enemiesArray[enemyTurnOrder.current[0]].hp ||
                enemyCurrentHP[enemyTurnOrder.current[1]] <
                  enemiesArray[enemyTurnOrder.current[1]].hp
              ) {
                if (
                  enemiesArray[enemyTurnOrder.current[0]].hp -
                    enemyCurrentHP[enemyTurnOrder.current[0]] >
                  enemiesArray[enemyTurnOrder.current[1]].hp -
                    enemyCurrentHP[enemyTurnOrder.current[1]]
                ) {
                  handleHeal(1, enemyCurrentHP);
                } else if (
                  enemiesArray[enemyTurnOrder.current[0]].hp -
                    enemyCurrentHP[enemyTurnOrder.current[0]] ===
                  enemiesArray[enemyTurnOrder.current[1]].hp -
                    enemyCurrentHP[enemyTurnOrder.current[1]]
                ) {
                  const selector = Math.floor(Math.random() * 2);
                  if (selector === 0) {
                    handleHeal(1, enemyCurrentHP);
                  } else {
                    handleHeal(2, enemyCurrentHP);
                  }
                } else {
                  handleHeal(2, enemyCurrentHP);
                }
              } else {
                const selector = Math.floor(Math.random() * 2);
                if (selector === 0) {
                  handleBuff(1);
                } else {
                  handleBuff(2);
                }
              }
              setIsEnemySupporting(true);
            }
          }
        }, 3500),
        setTimeout(() => {
          if (
            enemiesArray[enemyTurnOrder.current[2]].combatStyle ===
              "attacker" ||
            enemiesArray[enemyTurnOrder.current[2]].combatStyle === "tank"
          ) {
            resetEnemyAttacking();
          } else if (
            enemiesArray[enemyTurnOrder.current[2]].combatStyle === "support"
          ) {
            setIsEnemySupporting(false);
          }
          if (playerCurrentHP > 0 && !hasRevived) {
            setIsPlayersTurn(true);
            setCanAct(true);
          }
        }, 4400),
        setTimeout(() => {
          if (playerCurrentHP <= 0 && !hasDied && !notSecond) {
            hasDied = true;
            navigate({
              to: "/gameOverScreen",
              search: {
                enemies: enemiesArray,
              },
              mask: {
                to: "/game_over",
              },
            });
          }
        }, 5100),
        setTimeout(() => {
          if (playerCurrentHP <= 0 && !hasDied) {
            navigate({
              to: "/gameOverScreen",
              search: {
                enemies: enemiesArray,
              },
              mask: {
                to: "/game_over",
              },
            });
          }
        }, 6600);
    } else if (
      (enemyCurrentHP[0] > 0 && enemyCurrentHP[1] > 0) ||
      (enemyCurrentHP[0] > 0 && enemyCurrentHP[2] > 0) ||
      (enemyCurrentHP[1] > 0 && enemyCurrentHP[2] > 0)
    ) {
      const first = findLivingEnemies(enemyCurrentHP);
      const second = findLivingEnemies(enemyCurrentHP, first);
      const dead = findDeadEnemies(enemyCurrentHP);
      setTimeout(() => {
        if (!hasRevived) {
          if (
            enemiesArray[first].combatStyle === "attacker" ||
            enemiesArray[first].combatStyle === "tank"
          ) {
            setEnemyAttacking(first);
            playerCurrentHP =
              playerCurrentHP -
              (enemiesArray[first].damage + enemyBuffedDamage.current[first]);
            if (playerCurrentHP <= 0) {
              if (canRevive) {
                hasRevived = true;
                const revivalHp = Math.round(character[0].maxHp * 0.3);
                playerCurrentHP = revivalHp;
                setPlayerHP(revivalHp);
                setEquipment([equipment[0], {}]);
                const filteredInventory = character[2].filter(
                  (i) => i.name != "Revival Pendant",
                );
                setCharacter([character[0], character[1], filteredInventory]);
                canRevive = false;
                setHasPlayerRevived(true);
              } else {
                setPlayerHP(0);
              }
            } else {
              if (enemiesArray[first].class.includes("spider")) {
                const poisonRoll = Math.floor(Math.random() * 10);
                if (poisonRoll > poisonFailPercent)
                  setPoisonDamage((previousPoisonNum) => previousPoisonNum + 1);
              }
              if (enemiesArray[first].skill === "Bleed") {
                const bleedRoll = Math.floor(Math.random() * 10);
                if (bleedRoll > bleedFailPercent)
                  setBleedDamage((previousBleedNum) => previousBleedNum + 1);
              }
              setPlayerHP(
                (previousHP) =>
                  previousHP -
                  (enemiesArray[first].damage +
                    enemyBuffedDamage.current[first]),
              );
            }
          }
        }
      }, 500),
        setTimeout(() => {
          if (
            enemiesArray[first].combatStyle === "attacker" ||
            enemiesArray[first].combatStyle === "tank"
          ) {
            resetEnemyAttacking();
          }
          if (hasRevived) {
            setIsPlayersTurn(true);
            setCanAct(true);
          }
        }, 1400),
        setTimeout(() => {
          if (playerCurrentHP > 0 && !hasRevived) {
            if (
              enemiesArray[second].combatStyle === "attacker" ||
              enemiesArray[second].combatStyle === "tank"
            ) {
              setEnemyAttacking(second);
              playerCurrentHP =
                playerCurrentHP -
                (enemiesArray[second].damage +
                  enemyBuffedDamage.current[second]);
              if (playerCurrentHP <= 0) {
                if (canRevive) {
                  const revivalHp = Math.round(character[0].maxHp * 0.3);
                  playerCurrentHP = revivalHp;
                  setPlayerHP(revivalHp);
                  setEquipment([equipment[0], {}]);
                  const filteredInventory = character[2].filter(
                    (i) => i.name != "Revival Pendant",
                  );
                  setCharacter([character[0], character[1], filteredInventory]);
                  canRevive = false;
                  setHasPlayerRevived(true);
                } else {
                  notFirst = true;
                  setPlayerHP(0);
                }
              } else {
                if (enemiesArray[second].class.includes("spider")) {
                  const poisonRoll = Math.floor(Math.random() * 10);
                  if (poisonRoll > poisonFailPercent)
                    setPoisonDamage(
                      (previousPoisonNum) => previousPoisonNum + 1,
                    );
                }
                if (enemiesArray[second].skill === "Bleed") {
                  const bleedRoll = Math.floor(Math.random() * 10);
                  if (bleedRoll > bleedFailPercent)
                    setBleedDamage((previousBleedNum) => previousBleedNum + 1);
                }
                setPlayerHP(
                  (previousHP) =>
                    previousHP -
                    (enemiesArray[second].damage +
                      enemyBuffedDamage.current[second]),
                );
              }
            } else if (enemiesArray[second].combatStyle === "support") {
              if (enemyCurrentHP[first] < enemiesArray[first].hp) {
                const sortedArrayOfEnemyHP = [
                  {
                    index: first,
                    hp: enemyCurrentHP[first] + enemiesArray[second].heal,
                  },
                  {
                    index: second,
                    hp: enemyCurrentHP[second],
                  },
                  { index: dead, hp: 0 },
                ].sort((a, b) => a.index - b.index);
                setEnemyHP([
                  sortedArrayOfEnemyHP[0].hp,
                  sortedArrayOfEnemyHP[1].hp,
                  sortedArrayOfEnemyHP[2].hp,
                ]);
              } else {
                const sortedArrayOfEnemyBuffs = [
                  {
                    index: first,
                    buffNum:
                      enemyBuffedDamage.current[first] +
                      enemiesArray[second].buff,
                  },
                  {
                    index: second,
                    buffNum: enemyBuffedDamage.current[second],
                  },
                  { index: dead, buffNum: enemyBuffedDamage.current[dead] },
                ].sort((a, b) => a.index - b.index);
                enemyBuffedDamage.current = [
                  sortedArrayOfEnemyBuffs[0].buffNum,
                  sortedArrayOfEnemyBuffs[1].buffNum,
                  sortedArrayOfEnemyBuffs[2].buffNum,
                ];
              }
              setIsEnemySupporting(true);
            }
          }
        }, 2000),
        setTimeout(() => {
          if (
            enemiesArray[second].combatStyle === "attacker" ||
            enemiesArray[second].combatStyle === "tank"
          ) {
            resetEnemyAttacking();
          } else if (enemiesArray[second].combatStyle === "support") {
            setIsEnemySupporting(false);
          }
          if (playerCurrentHP > 0 && !hasRevived) {
            setIsPlayersTurn(true);
            setCanAct(true);
          }
        }, 2900),
        setTimeout(() => {
          if (playerCurrentHP <= 0 && !notFirst) {
            hasDied = true;
            navigate({
              to: "/gameOverScreen",
              search: {
                enemies: enemiesArray,
              },
              mask: {
                to: "/game_over",
              },
            });
          }
        }, 3500),
        setTimeout(() => {
          if (playerCurrentHP <= 0 && !hasDied) {
            navigate({
              to: "/gameOverScreen",
              search: {
                enemies: enemiesArray,
              },
              mask: {
                to: "/game_over",
              },
            });
          }
        }, 5100);
    } else if (
      enemyCurrentHP[0] > 0 ||
      enemyCurrentHP[1] > 0 ||
      enemyCurrentHP[2] > 0
    ) {
      const living = findLivingEnemies(enemyCurrentHP);
      const firstDead = findDeadEnemies(enemyCurrentHP);
      const secondDead = findDeadEnemies(enemyCurrentHP, firstDead);
      setTimeout(() => {
        if (!hasRevived) {
          if (
            enemiesArray[living].combatStyle === "attacker" ||
            enemiesArray[living].combatStyle === "tank" ||
            (enemiesArray[living].combatStyle === "support" &&
              enemyCurrentHP[living] >= enemiesArray[living].hp)
          ) {
            setEnemyAttacking(living);
            playerCurrentHP =
              playerCurrentHP -
              (enemiesArray[living].damage + enemyBuffedDamage.current[living]);
            if (playerCurrentHP <= 0) {
              if (canRevive) {
                const revivalHp = Math.round(character[0].maxHp * 0.3);
                playerCurrentHP = revivalHp;
                setPlayerHP(revivalHp);
                setEquipment([equipment[0], {}]);
                const filteredInventory = character[2].filter(
                  (i) => i.name != "Revival Pendant",
                );
                setCharacter([character[0], character[1], filteredInventory]);
                setHasPlayerRevived(true);
              } else {
                setPlayerHP(0);
              }
            } else {
              if (enemiesArray[living].class.includes("spider")) {
                const poisonRoll = Math.floor(Math.random() * 10);
                if (poisonRoll > poisonFailPercent)
                  setPoisonDamage((previousPoisonNum) => previousPoisonNum + 1);
              }
              if (enemiesArray[living].skill === "Bleed") {
                const bleedRoll = Math.floor(Math.random() * 10);
                if (bleedRoll > bleedFailPercent)
                  setBleedDamage((previousBleedNum) => previousBleedNum + 1);
              }
              setPlayerHP(
                (previousHP) =>
                  previousHP -
                  (enemiesArray[living].damage +
                    enemyBuffedDamage.current[living]),
              );
            }
          } else if (enemiesArray[living].combatStyle === "support") {
            const sortedArrayOfEnemyHP = [
              {
                index: living,
                hp: enemyCurrentHP[living] + enemiesArray[living].heal,
              },
              {
                index: firstDead,
                hp: 0,
              },
              { index: secondDead, hp: 0 },
            ].sort((a, b) => a.index - b.index);
            setEnemyHP([
              sortedArrayOfEnemyHP[0].hp,
              sortedArrayOfEnemyHP[1].hp,
              sortedArrayOfEnemyHP[2].hp,
            ]);
            setIsEnemySupporting(true);
          }
        }
      }, 500),
        setTimeout(() => {
          if (
            enemiesArray[living].combatStyle === "attacker" ||
            enemiesArray[living].combatStyle === "tank" ||
            (enemiesArray[living].combatStyle === "support" &&
              enemyCurrentHP[living] >= enemiesArray[living].hp)
          ) {
            resetEnemyAttacking();
          } else if (enemiesArray[living].combatStyle === "support") {
            setIsEnemySupporting(false);
          }
          if (playerCurrentHP > 0) {
            setIsPlayersTurn(true);
            setCanAct(true);
          }
        }, 1400),
        setTimeout(() => {
          if (playerCurrentHP <= 0) {
            navigate({
              to: "/gameOverScreen",
              search: {
                enemies: enemiesArray,
              },
              mask: {
                to: "/game_over",
              },
            });
          }
        }, 3500);
    }
  };

  const handleBattleOver = (enemyCurrentHP, runAwayCheck) => {
    if (
      (enemyCurrentHP[0] <= 0 &&
        enemyCurrentHP[1] <= 0 &&
        enemyCurrentHP[2] <= 0) ||
      runAwayCheck
    ) {
      setTimeout(() => {
        setCharacter([
          {
            type: character[0].type,
            hp: playerHP,
            maxHp: character[0].maxHp,
            gold: character[0].gold,
            hasRevived: hasPlayerRevived,
            isFloorCompleted: true,
            isShopNext: character[0].isShopNext,
          },
          character[1],
          character[2],
          character[3],
          character[4],
        ]);
        if (runAwayCheck) goldDropped.current = 0;
        navigate({
          to: "/victoryScreen",
          search: {
            gold: goldDropped.current,
            killCount: enemiesKilled.current,
          },
          mask: {
            to: `/floor_${character[1]}`,
          },
        });
      }, 1700);
    }
  };

  function handleTurn(number, enemyWeakness) {
    let timer;
    // let playerTurnTiming = 900;
    let playerCurrentHP = playerHP;
    let enemyCurrentHP = enemyHP;
    let canRevive = false;
    let hasRevived = false;
    let runAwayCheck = false;
    setCanAct(false);

    if (equipment[1].name) {
      if (equipment[1].name === "Revival Pendant") {
        canRevive = true;
      }
    }

    if (number > 0) {
      enemyCurrentHP = handlePlayerAttack(
        enemyCurrentHP,
        number,
        enemyWeakness,
      );
    } else runAwayCheck = handleRunAwayCheck();
    if (
      poisonDamage > 0 &&
      (enemyCurrentHP[0] > 0 || enemyCurrentHP[1] > 0 || enemyCurrentHP[2] > 0)
    ) {
      playerCurrentHP = playerCurrentHP - poisonDamage;
      // playerTurnTiming = 1100;
    }
    if (
      bleedDamage > 0 &&
      (enemyCurrentHP[0] > 0 || enemyCurrentHP[1] > 0 || enemyCurrentHP[2] > 0)
    ) {
      playerCurrentHP = playerCurrentHP - bleedDamage * 2;
      // playerTurnTiming = 1100;
    }
    timer = setTimeout(() => {
      resetEnemyAttacked();
      if (
        enemyCurrentHP[number - 1] <= 0 &&
        hoveredEnemy.name === enemiesArray[number - 1].name
      ) {
        setHoveredEnemy({});
      }
      if (
        poisonDamage > 0 &&
        (enemyCurrentHP[0] > 0 ||
          enemyCurrentHP[1] > 0 ||
          enemyCurrentHP[2] > 0) &&
        !runAwayCheck
      ) {
        if (playerCurrentHP > 0) {
          setPlayerHP((previousHP) => previousHP - poisonDamage);
          setIsPlayersTurn(false);
        } else {
          if (canRevive) {
            hasRevived = true;
            const revivalHp = Math.round(character[0].maxHp * 0.3);
            playerCurrentHP = revivalHp;
            setPlayerHP(revivalHp);
            setEquipment([equipment[0], {}]);
            const filteredInventory = character[2].filter(
              (i) => i.name != "Revival Pendant",
            );
            setCharacter([character[0], character[1], filteredInventory]);
            canRevive = false;
            setHasPlayerRevived(true);
            setIsPlayersTurn(true);
            setCanAct(true);
          } else setPlayerHP(0);
        }
        setPoisonDamage((previousPoisonNum) => previousPoisonNum - 1);
      }
      if (
        bleedDamage > 0 &&
        (enemyCurrentHP[0] > 0 ||
          enemyCurrentHP[1] > 0 ||
          enemyCurrentHP[2] > 0) &&
        !runAwayCheck
      ) {
        if (playerCurrentHP > 0) {
          setPlayerHP((previousHP) => previousHP - bleedDamage * 2);
          setIsPlayersTurn(false);
        } else {
          if (canRevive) {
            hasRevived = true;
            const revivalHp = Math.round(character[0].maxHp * 0.3);
            playerCurrentHP = revivalHp;
            setPlayerHP(revivalHp);
            setEquipment([equipment[0], {}]);
            const filteredInventory = character[2].filter(
              (i) => i.name != "Revival Pendant",
            );
            setCharacter([character[0], character[1], filteredInventory]);
            canRevive = false;
            setHasPlayerRevived(true);
            setIsPlayersTurn(true);
            setCanAct(true);
          } else setPlayerHP(0);
        }
        setBleedDamage(0);
      }
      if (
        poisonDamage === 0 &&
        bleedDamage === 0 &&
        (enemyCurrentHP[0] > 0 ||
          enemyCurrentHP[1] > 0 ||
          enemyCurrentHP[2] > 0) &&
        !runAwayCheck
      )
        setIsPlayersTurn(false);
      if (
        playerCurrentHP > 0 &&
        !runAwayCheck &&
        (enemyCurrentHP[0] > 0 ||
          enemyCurrentHP[1] > 0 ||
          enemyCurrentHP[2] > 0)
      )
        handleEnemyAttacks(
          playerCurrentHP,
          enemyCurrentHP,
          canRevive,
          hasRevived,
        );
    }, 900);
    setTimeout(() => {
      if (playerCurrentHP <= 0) {
        navigate({
          to: "/gameOverScreen",
          search: {
            enemies: enemiesArray,
          },
          mask: {
            to: "/game_over",
          },
        });
      }
    }, 3900);

    handleBattleOver(enemyCurrentHP, runAwayCheck);

    return () => {
      clearTimeout(timer);
    };
  }

  const resetEnemyAttacking = () => {
    setIsEnemyAttacking([false, false, false]);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (hoveredEnemy.name === enemiesArray[e.target.dataset.value].name) {
      setHoveredEnemy({});
    } else {
      setHoveredEnemy(enemiesArray[e.target.dataset.value]);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="stage-container">
      <h1
        className={
          isPlayersTurn ? "turn-tracker player-turn" : "turn-tracker enemy-turn"
        }
      >
        {isPlayersTurn ? "Your Turn" : "Enemy's Turn"}
      </h1>
      <button
        className="escape-btn"
        onClick={() => (canAct ? handleTurn(0, "") : null)}
        disabled={!canAct}
      >
        escape
      </button>
      <div className="stage">
        <div className="toggle-info-btns">
          {enemyHP[0] > 0 ? (
            <button
              className={
                hoveredEnemy != enemiesArray[0]
                  ? "toggle-info-btn"
                  : "toggle-info-btn clicked"
              }
              onClick={() =>
                hoveredEnemy.name === enemiesArray[0].name
                  ? setHoveredEnemy({})
                  : setHoveredEnemy(enemiesArray[0])
              }
            >
              enemy #1 info
            </button>
          ) : null}
          {enemyHP[1] > 0 ? (
            <button
              className={
                hoveredEnemy != enemiesArray[1]
                  ? "toggle-info-btn"
                  : "toggle-info-btn clicked"
              }
              onClick={() =>
                hoveredEnemy.name === enemiesArray[1].name
                  ? setHoveredEnemy({})
                  : setHoveredEnemy(enemiesArray[1])
              }
            >
              enemy #2 info
            </button>
          ) : null}
          {enemiesArray.length === 3 && enemyHP[2] > 0 ? (
            <button
              className={
                hoveredEnemy != enemiesArray[2]
                  ? "toggle-info-btn"
                  : "toggle-info-btn clicked"
              }
              onClick={() =>
                hoveredEnemy.name === enemiesArray[2].name
                  ? setHoveredEnemy({})
                  : setHoveredEnemy(enemiesArray[2])
              }
            >
              enemy #3 info
            </button>
          ) : null}
        </div>
        <section className="combat-area">
          <Player
            hp={playerHP}
            maxHp={character[0].maxHp}
            isRunningAway={isRunningAway}
            isEA={isEnemyAttacking}
            isPA={isPlayerAttacking}
            poisonNum={poisonDamage}
            bleedNum={bleedDamage}
            hasRevived={hasPlayerRevived}
          />
          <section className="enemies">
            {EnemyPositions.map((pos, index) =>
              enemiesArray[index] ? (
                <Enemy
                  key={index}
                  enemy={enemiesArray[index]}
                  hp={enemyHP[index]}
                  buffNum={enemyBuffedDamage.current[index]}
                  position={pos}
                  enemyNum={index + 1}
                  isPA={isPlayerAttacking[index]}
                  isEA={isEnemyAttacking[index]}
                  isES={isEnemySupporting}
                  canAct={canAct}
                  handleTurn={handleTurn}
                  handleRightClick={handleRightClick}
                />
              ) : (
                <div className={`${pos} blankSpace`} key={index} />
              ),
            )}
          </section>
        </section>
      </div>
      <div className="inventory-container">
        <section className="active-items">
          <div className={`active-item ${equipment[0].class}`}>
            <div className="active-item-portrait-area">
              <p className="active-item-name">{equipment[0].name}</p>
              {equipment[0].element != "Normal" ? (
                <span
                  className={`weakness-icon ${equipment[0].element.toLowerCase()}`}
                />
              ) : null}
            </div>
            <p className="active-item-damage">
              damage:{" "}
              <span className="active-item-text">{equipment[0].damage}</span>
            </p>
            {equipment[0].strong ? (
              <p className="active-item-strong-against">
                <b className="font-change">x</b>2 -{">"}
                <span className={`type-icon ${equipment[0].strong}`} />
              </p>
            ) : null}
          </div>
          {equipment[1].name ? (
            <div className={`active-item ${equipment[1].class}`}>
              <div className="active-item-portrait-area">
                {equipment[1].element != "Normal" ? (
                  <span
                    className={`weakness-icon ${equipment[1].element.toLowerCase()}`}
                  />
                ) : null}
                <p className="active-item-name">{equipment[1].name}</p>
              </div>
              <p
                className={
                  equipment[1].effect.length < 18
                    ? "active-item-effect"
                    : "active-item-effect  xl"
                }
              >
                effect:{" "}
                <span className="active-item-text">{equipment[1].effect}</span>
              </p>
              <p
                className={
                  equipment[1].effect.length < 18
                    ? "active-item-durability"
                    : "active-item-durability xl"
                }
              >
                durability:{" "}
                <span className="active-item-text">
                  {equipment[1].durability}
                </span>
              </p>
            </div>
          ) : (
            <div className={`active-item`} />
          )}
        </section>
        <h1 className="inventory-title">
          <span className="gold-amount-text">
            <div className="other-icon-inventory gold-bag"></div>
            {character[0].gold}
          </span>
          inventory
        </h1>
        <section className="inventory">
          {character[2].map((i, index) => (
            <div
              key={index}
              className={
                canAct
                  ? `inventory-item ${i.class}`
                  : `inventory-item disabled ${i.class}`
              }
              onClick={() => {
                (i.type === "Weapon" && i.name === equipment[0].name) ||
                (i.type === "Accessory" && i.name === equipment[1].name)
                  ? null
                  : i.type === "Weapon" && canAct
                    ? setEquipment([i, equipment[1]])
                    : i.type === "Accessory" && canAct
                      ? setEquipment([equipment[0], i])
                      : null;
              }}
            >
              {/* <p className="active-item-name">{i.name}</p> */}
            </div>
          ))}
        </section>
      </div>
      {hoveredEnemy.name ? (
        <div className="enemy-info-container">
          <h2 className="enemy-info-title">{hoveredEnemy.name}</h2>
          <p className="enemy-info">
            type: <span className="enemy-info-text">{hoveredEnemy.type}</span>
            <span
              className={`type-icon-info ${hoveredEnemy.type.toLowerCase()}`}
            />{" "}
            <span className="enemy-info-text-space">-</span> weakness:{" "}
            <span className="enemy-info-text">{hoveredEnemy.weakness}</span>
            <span
              className={`weakness-icon-info ${hoveredEnemy.weakness.toLowerCase()}`}
            />
          </p>
          <p className="enemy-info class-text">
            class:{" "}
            <span className="enemy-info-text">{hoveredEnemy.combatStyle}</span>
            <span
              className={`type-icon-info ${hoveredEnemy.combatStyle}`}
            />{" "}
          </p>
          <p className="enemy-info">
            health: <span className="enemy-info-text">{hoveredEnemy.hp}</span>{" "}
            <span className="enemy-info-text-space">-</span> speed:{" "}
            <span className="enemy-info-text">{hoveredEnemy.speed}</span>
          </p>
          {hoveredEnemy.combatStyle === "attacker" ||
          hoveredEnemy.combatStyle === "tank" ? (
            <p className="enemy-info">
              damage:{" "}
              <span className="enemy-info-text">{hoveredEnemy.damage}</span>
              {hoveredEnemy.skill ? (
                <>
                  {" "}
                  <span className="enemy-info-text-space">-</span> skill:{" "}
                  <span className="enemy-info-text">{hoveredEnemy.skill}</span>
                </>
              ) : null}
            </p>
          ) : (
            <p className="enemy-info">
              heal: <span className="enemy-info-text">{hoveredEnemy.heal}</span>{" "}
              <span className="enemy-info-text-space">-</span> damage buff:{" "}
              <span className="enemy-info-text">{hoveredEnemy.buff}</span>
            </p>
          )}
          <p className="enemy-info">
            gold: <span className="enemy-info-text">{hoveredEnemy.gold}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
