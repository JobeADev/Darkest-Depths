function Enemy({
  boss,
  turnCount,
  enemy,
  hp,
  buffNum,
  position,
  enemyNum,
  isPA,
  isEA,
  isES,
  canAct,
  handleTurn,
  handleRightClick,
}) {
  return (
    <div
      className={
        boss === "Necromancer" &&
        (turnCount === 0 || (turnCount % 4 === 0 && isES)) &&
        hp > 0 &&
        (position === "first" || position === "third")
          ? `${position} being-summoned`
          : hp > 0
            ? position
            : `${position} dead`
      }
    >
      <div
        className={
          isPA
            ? `enemyChar ${position}Enemy beingDamaged ${enemy.class}`
            : isEA ||
                ((enemy.combatStyle === "support" ||
                  enemy.combatStyle === "boss") &&
                  isES)
              ? `enemyChar ${position}Enemy isAttacking ${enemy.class}`
              : `enemyChar ${position}Enemy ${enemy.class}`
        }
        onClick={() =>
          canAct && hp > 0 ? handleTurn(enemyNum, enemy.weakness) : null
        }
        onContextMenu={hp > 0 ? handleRightClick : null}
        data-value={enemyNum - 1}
      >
        <i
          className={
            position === "second"
              ? "fa-solid fa-caret-down boss-caret"
              : "fa-solid fa-caret-down"
          }
        />
        <span className="enemyHP">
          {hp}
          {/* <span className="damage-preview">-{equipment[0].damage}</span> */}{" "}
          / {enemy.hp}
        </span>
        <section className="enemy-status-section">
          {enemy.combatStyle === "tank" ? (
            <div
              className={
                buffNum === 0
                  ? "icon16x16 tank-shield"
                  : "status-spacer icon16x16 tank-shield"
              }
            ></div>
          ) : null}
          {buffNum > 0 ? (
            <div className="buffed-info">+{buffNum} 💪</div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default Enemy;
