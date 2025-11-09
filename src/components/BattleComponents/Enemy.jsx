function Enemy({
  enemy,
  hp,
  buffNum,
  position,
  enemyNum,
  playerDamage,
  isWeak,
  isPA,
  isEA,
  isES,
  canAct,
  handleTurn,
  handleRightClick,
}) {
  return (
    <div className={hp > 0 ? position : `${position} dead`}>
      <div
        className={
          isPA
            ? `enemyChar ${position}Enemy beingDamaged`
            : isEA || (enemy.combatStyle === "support" && isES)
              ? `enemyChar ${position}Enemy isAttacking`
              : `enemyChar ${position}Enemy`
        }
      >
        <img
          src={enemy.img}
          onClick={() =>
            canAct && hp > 0 ? handleTurn(enemyNum, enemy.weakness) : null
          }
          onContextMenu={hp > 0 ? handleRightClick : null}
          data-value={enemyNum - 1}
        />
        <i className="fa-solid fa-caret-down" />
        <span className="enemyHP">
          {hp}
          <span className="damage-preview">
            {isWeak && hp > 0
              ? `- ${playerDamage * 2}`
              : hp > 0
                ? `- ${playerDamage}`
                : null}
          </span>{" "}
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
