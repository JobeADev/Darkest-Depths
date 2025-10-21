import { useState, useEffect, useContext, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CharacterContext, EquipmentContext } from "../components/contexts";
import Player from "../components/BattleComponents/Player";
import BossEnemy from "../components/BattleComponents/BossEnemy";
import Loader from "../components/Loader";
import { BossEnemiesList, EnemyPositions } from "../components/data";
import "./bossBattle.css";

export const Route = createFileRoute("/bossBattle")({
  component: BossBattle,
});

function BossBattle() {
  const navigate = useNavigate();
  const [character, setCharacter] = useContext(CharacterContext);
  const [equipment, setEquipment] = useContext(EquipmentContext);
  const [isLoading, setIsLoading] = useState(true);
  const [turnCount, setTurnCount] = useState(0);
  const [hoveredEnemy, setHoveredEnemy] = useState({});
  const [enemiesArray] = useState(BossEnemiesList[0]);
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
  const enemyBuffedDamage = useRef([0, 0, 0]);
  const goldDropped = useRef(0);
  const enemiesKilled = useRef(0);
  const [hasPlayerRevived, setHasPlayerRevived] = useState(
    character[0].hasRevived,
  );
  const tankFailPercent = 6; // this represents 70% to fail, 30% chance for success
  const bleedFailPercent = 6; // this represents 70% to fail, 30% chance for success

  useEffect(() => {
    const turnOrder = [
      {
        speed: enemiesArray[0].speed,
        index: 0,
      },
      {
        speed: enemiesArray[1].speed,
        index: 1,
      },
      {
        speed: enemiesArray[2].speed,
        index: 2,
      },
    ].sort((a, b) => b.speed - a.speed);
    enemyTurnOrder.current = [
      turnOrder[0].index,
      turnOrder[1].index,
      turnOrder[2].index,
    ];
    if (enemiesArray === BossEnemiesList[0]) {
      setIsPlayersTurn(false);
      setCanAct(false);
      setEnemyHP([enemiesArray[0].hp, enemiesArray[1].hp, enemiesArray[2].hp]);
      setTimeout(() => {
        setIsEnemySupporting(true);
      }, 400);
      setTimeout(() => {
        setTurnCount(1);
        setIsEnemySupporting(false);
        setIsPlayersTurn(true);
        setCanAct(true);
      }, 1300);
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

  const handleBossBuffing = (enemyCurrentHP) => {
    if (enemyCurrentHP[0] === 0) {
      enemyBuffedDamage.current = [
        enemyBuffedDamage.current[0],
        enemyBuffedDamage.current[1],
        enemyBuffedDamage.current[2] + enemiesArray[1].buff,
      ];
    } else if (enemyCurrentHP[2] === 0) {
      enemyBuffedDamage.current = [
        enemyBuffedDamage.current[0] + enemiesArray[1].buff,
        enemyBuffedDamage.current[1],
        enemyBuffedDamage.current[2],
      ];
    } else {
      enemyBuffedDamage.current = [
        enemyBuffedDamage.current[0] + enemiesArray[1].buff,
        enemyBuffedDamage.current[1],
        enemyBuffedDamage.current[2] + enemiesArray[1].buff,
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
      if (enemyCurrentHP[0] - (equipment[0].damage + strongAgainst) > 0) {
        enemyCurrentHP = [
          enemyCurrentHP[0] - (equipment[0].damage + strongAgainst),
          enemyCurrentHP[1],
          enemyCurrentHP[2],
        ];
      } else {
        enemyCurrentHP = [0, enemyCurrentHP[1], enemyCurrentHP[2]];
        enemyBuffedDamage.current = [
          0,
          enemyBuffedDamage.current[1],
          enemyBuffedDamage.current[2],
        ];
        goldDropped.current = goldDropped.current + enemiesArray[0].gold;
        enemiesKilled.current = enemiesKilled.current + 1;
      }
      setEnemyHP([enemyCurrentHP[0], enemyHP[1], enemyHP[2]]);
    } else if (number === 2 && enemyCurrentHP[1] > 0) {
      if (guardRoll > tankFailPercent) {
        if (enemiesArray[0].combatStyle === "tank" && enemyCurrentHP[0] > 0) {
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
            enemyBuffedDamage.current = [
              0,
              enemyBuffedDamage.current[1],
              enemyBuffedDamage.current[2],
            ];
            goldDropped.current = goldDropped.current + enemiesArray[0].gold;
            enemiesKilled.current = enemiesKilled.current + 1;
          }
          setEnemyHP([enemyCurrentHP[0], enemyHP[1], enemyHP[2]]);
          number = 1;
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
          enemyBuffedDamage.current = [
            enemyBuffedDamage.current[0],
            0,
            enemyBuffedDamage.current[2],
          ];
          goldDropped.current = goldDropped.current + enemiesArray[1].gold;
          enemiesKilled.current = enemiesKilled.current + 1;
        }
        setEnemyHP([enemyHP[0], enemyCurrentHP[1], enemyHP[2]]);
      }
    } else if (number === 3 && enemyCurrentHP[2] > 0) {
      if (guardRoll > tankFailPercent) {
        if (enemiesArray[0].combatStyle === "tank" && enemyCurrentHP[0] > 0) {
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
            enemyBuffedDamage.current = [
              0,
              enemyBuffedDamage.current[1],
              enemyBuffedDamage.current[2],
            ];
            goldDropped.current = goldDropped.current + enemiesArray[0].gold;
            enemiesKilled.current = enemiesKilled.current + 1;
          }
          setEnemyHP([enemyCurrentHP[0], enemyHP[1], enemyHP[2]]);
          number = 1;
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
          enemyBuffedDamage.current = [
            enemyBuffedDamage.current[0],
            enemyBuffedDamage.current[1],
            0,
          ];
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
            enemiesArray[enemyTurnOrder.current[0]].combatStyle === "tank" ||
            (enemiesArray[enemyTurnOrder.current[0]].combatStyle === "boss" &&
              turnCount % 4 !== 0 &&
              enemiesArray[1].name === "Necromancer")
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
                setCharacter([
                  character[0],
                  character[1],
                  filteredInventory,
                  character[3],
                  character[4],
                ]);
                canRevive = false;
                setHasPlayerRevived(true);
              } else {
                setPlayerHP(0);
              }
            } else {
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
          } else if (
            enemiesArray[enemyTurnOrder.current[0]].combatStyle === "boss"
          ) {
            if (turnCount % 4 === 0 && enemiesArray[1].name === "Necromancer") {
              setEnemyAttacking(enemyTurnOrder.current[0]);
              handleBossBuffing(enemyCurrentHP);
              setPoisonDamage(2);
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
          } else if (
            enemiesArray[enemyTurnOrder.current[0]].combatStyle === "boss"
          ) {
            resetEnemyAttacking();
            setIsEnemySupporting(false);
          }
          if (hasRevived) {
            setIsPlayersTurn(true);
            setCanAct(true);
            setTurnCount((prevCount) => prevCount + 1);
            hasDied = true;
          }
        }, 1400),
        setTimeout(() => {
          if (playerCurrentHP > 0 && !hasRevived) {
            if (
              enemiesArray[enemyTurnOrder.current[1]].combatStyle ===
                "attacker" ||
              enemiesArray[enemyTurnOrder.current[1]].combatStyle === "tank" ||
              (enemiesArray[enemyTurnOrder.current[1]].combatStyle === "boss" &&
                turnCount % 4 !== 0 &&
                enemiesArray[1].name === "Necromancer")
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
                  setCharacter([
                    character[0],
                    character[1],
                    filteredInventory,
                    character[3],
                    character[4],
                  ]);
                  canRevive = false;
                  setHasPlayerRevived(true);
                } else {
                  notFirst = true;
                  setPlayerHP(0);
                }
              } else {
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
            } else if (
              enemiesArray[enemyTurnOrder.current[1]].combatStyle === "boss"
            ) {
              if (
                turnCount % 4 === 0 &&
                enemiesArray[1].name === "Necromancer"
              ) {
                setEnemyAttacking(enemyTurnOrder.current[1]);
                handleBossBuffing(enemyCurrentHP);
                setPoisonDamage(2);
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
          } else if (
            enemiesArray[enemyTurnOrder.current[1]].combatStyle === "boss"
          ) {
            resetEnemyAttacking();
            setIsEnemySupporting(false);
          }
          if (hasRevived && !hasDied) {
            setIsPlayersTurn(true);
            setCanAct(true);
            setTurnCount((prevCount) => prevCount + 1);
            hasDied = true;
          }
        }, 2900),
        setTimeout(() => {
          if (playerCurrentHP <= 0 && !notFirst) {
            hasDied = true;
            navigate({
              to: "/gameOverScreen",
              search: {
                playerRevived: hasPlayerRevived,
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
              enemiesArray[enemyTurnOrder.current[2]].combatStyle === "tank" ||
              (enemiesArray[enemyTurnOrder.current[2]].combatStyle === "boss" &&
                turnCount % 4 !== 0 &&
                enemiesArray[1].name === "Necromancer")
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
                  setCharacter([
                    character[0],
                    character[1],
                    filteredInventory,
                    character[3],
                    character[4],
                  ]);
                  canRevive = false;
                  setHasPlayerRevived(true);
                } else {
                  notSecond = true;
                  setPlayerHP(0);
                }
              } else {
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
          } else if (
            enemiesArray[enemyTurnOrder.current[2]].combatStyle === "boss"
          ) {
            if (turnCount % 4 === 0 && enemiesArray[1].name === "Necromancer") {
              setEnemyAttacking(enemyTurnOrder.current[2]);
              handleBossBuffing(enemyCurrentHP);
              setPoisonDamage(2);
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
          } else if (
            enemiesArray[enemyTurnOrder.current[2]].combatStyle === "boss"
          ) {
            resetEnemyAttacking();
            setIsEnemySupporting(false);
          }
          if (playerCurrentHP > 0 && !hasRevived) {
            setIsPlayersTurn(true);
            setCanAct(true);
            setTurnCount((prevCount) => prevCount + 1);
          }
        }, 4400),
        setTimeout(() => {
          if (playerCurrentHP <= 0 && !hasDied && !notSecond) {
            hasDied = true;
            navigate({
              to: "/gameOverScreen",
              search: {
                playerRevived: hasPlayerRevived,
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
                playerRevived: hasPlayerRevived,
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
            enemiesArray[first].combatStyle === "tank" ||
            (enemiesArray[first].combatStyle === "boss" &&
              turnCount % 4 !== 0 &&
              enemiesArray[1].name === "Necromancer")
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
                setCharacter([
                  character[0],
                  character[1],
                  filteredInventory,
                  character[3],
                  character[4],
                ]);
                canRevive = false;
                setHasPlayerRevived(true);
              } else {
                setPlayerHP(0);
              }
            } else {
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
          } else if (enemiesArray[first].combatStyle === "boss") {
            if (turnCount % 4 === 0 && enemiesArray[1].name === "Necromancer") {
              setEnemyAttacking(first);
              handleBossBuffing(enemyCurrentHP);
              setPoisonDamage(2);
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
          if (enemiesArray[first].combatStyle === "boss") {
            resetEnemyAttacking();
            setIsEnemySupporting(false);
          }
          if (hasRevived) {
            setIsPlayersTurn(true);
            setCanAct(true);
            setTurnCount((prevCount) => prevCount + 1);
          }
        }, 1400),
        setTimeout(() => {
          if (playerCurrentHP > 0 && !hasRevived) {
            if (
              enemiesArray[second].combatStyle === "attacker" ||
              enemiesArray[second].combatStyle === "tank" ||
              (enemiesArray[second].combatStyle === "boss" &&
                turnCount % 4 !== 0 &&
                enemiesArray[1].name === "Necromancer")
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
                  setCharacter([
                    character[0],
                    character[1],
                    filteredInventory,
                    character[3],
                    character[4],
                  ]);
                  canRevive = false;
                  setHasPlayerRevived(true);
                } else {
                  notFirst = true;
                  setPlayerHP(0);
                }
              } else {
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
            } else if (enemiesArray[second].combatStyle === "boss") {
              if (
                turnCount % 4 === 0 &&
                enemiesArray[1].name === "Necromancer"
              ) {
                setEnemyAttacking(second);
                handleBossBuffing(enemyCurrentHP);
                setPoisonDamage(2);
              }
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
          } else if (enemiesArray[second].combatStyle === "boss") {
            resetEnemyAttacking();
            setIsEnemySupporting(false);
          }
          if (playerCurrentHP > 0 && !hasRevived) {
            setIsPlayersTurn(true);
            setCanAct(true);
            setTurnCount((prevCount) => prevCount + 1);
          }
        }, 2900),
        setTimeout(() => {
          if (playerCurrentHP <= 0 && !notFirst) {
            hasDied = true;
            navigate({
              to: "/gameOverScreen",
              search: {
                playerRevived: hasPlayerRevived,
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
                playerRevived: hasPlayerRevived,
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
              enemyCurrentHP[living] >= enemiesArray[living].hp) ||
            (enemiesArray[living].combatStyle === "boss" &&
              turnCount % 4 !== 0 &&
              enemiesArray[1].name === "Necromancer")
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
                setCharacter([
                  character[0],
                  character[1],
                  filteredInventory,
                  character[3],
                  character[4],
                ]);
                setHasPlayerRevived(true);
              } else {
                setPlayerHP(0);
              }
            } else {
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
          } else if (enemiesArray[living].combatStyle === "boss") {
            if (turnCount % 4 === 0 && enemiesArray[1].name === "Necromancer") {
              setEnemyHP([
                enemiesArray[0].hp,
                enemyCurrentHP[1],
                enemiesArray[2].hp,
              ]);
              setIsEnemySupporting(true);
            }
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
          } else if (enemiesArray[living].combatStyle === "boss") {
            resetEnemyAttacking();
            setIsEnemySupporting(false);
          }
          if (playerCurrentHP > 0) {
            setIsPlayersTurn(true);
            setCanAct(true);
            setTurnCount((prevCount) => prevCount + 1);
          }
        }, 1400),
        setTimeout(() => {
          if (playerCurrentHP <= 0) {
            navigate({
              to: "/gameOverScreen",
              search: {
                playerRevived: hasPlayerRevived,
              },
              mask: {
                to: "/game_over",
              },
            });
          }
        }, 3500);
    }
  };

  const handleBattleOver = (enemyCurrentHP) => {
    if (
      (enemyCurrentHP[0] <= 0 && enemiesArray[0].combatStyle === "boss") ||
      (enemyCurrentHP[1] <= 0 && enemiesArray[1].combatStyle === "boss") ||
      (enemyCurrentHP[2] <= 0 && enemiesArray[2].combatStyle === "boss")
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
        navigate({
          to: "/victoryScreen",
          search: {
            gold: goldDropped.current,
            killCount: enemiesKilled.current,
          },
          mask: {
            to: "/boss",
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
    }
    if (poisonDamage > 0 && enemyCurrentHP[1] > 0) {
      playerCurrentHP = playerCurrentHP - poisonDamage;
      // playerTurnTiming = 1100;
    }
    if (bleedDamage > 0 && enemyCurrentHP[1] > 0) {
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
      if (poisonDamage > 0 && enemyCurrentHP[1] > 0 && !runAwayCheck) {
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
            setCharacter([
              character[0],
              character[1],
              filteredInventory,
              character[3],
              character[4],
            ]);
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
        enemyCurrentHP[1] > 0 &&
        !runAwayCheck
        // (enemyCurrentHP[0] > 0 ||
        //   enemyCurrentHP[1] > 0 ||
        //   enemyCurrentHP[2] > 0)
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
            setCharacter([
              character[0],
              character[1],
              filteredInventory,
              character[3],
              character[4],
            ]);
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
        enemyCurrentHP[1] > 0 &&
        !runAwayCheck
      )
        setIsPlayersTurn(false);
      if (!runAwayCheck && enemyCurrentHP[1] > 0)
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
            playerRevived: hasPlayerRevived,
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
      <button className="escape-btn" disabled>
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
            isEA={isEnemyAttacking}
            isPA={isPlayerAttacking}
            poisonNum={poisonDamage}
            bleedNum={bleedDamage}
            hasRevived={hasPlayerRevived}
          />
          <section className="enemies">
            {EnemyPositions.map((pos, index) =>
              enemiesArray[index] ? (
                <BossEnemy
                  key={index}
                  boss={enemiesArray[1].name}
                  turnCount={turnCount}
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
          hoveredEnemy.combatStyle === "tank" ||
          hoveredEnemy.combatStyle === "boss" ? (
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
          {hoveredEnemy.combatStyle !== "boss" ? (
            <p className="enemy-info">
              gold: <span className="enemy-info-text">{hoveredEnemy.gold}</span>
            </p>
          ) : (
            <p className="enemy-info">
              {hoveredEnemy.skill2 ? (
                <>
                  <span>skill: </span>
                  <span className="enemy-info-text">
                    {hoveredEnemy.skill2}
                  </span>{" "}
                  <span className="enemy-info-text-space">-</span>
                </>
              ) : null}{" "}
              {hoveredEnemy.heal ? (
                <>
                  <span>heal: </span>
                  <span className="enemy-info-text">
                    {hoveredEnemy.heal}
                  </span>{" "}
                  <span className="enemy-info-text-space">-</span>
                </>
              ) : null}{" "}
              damage buff:{" "}
              <span className="enemy-info-text">{hoveredEnemy.buff}</span>
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
