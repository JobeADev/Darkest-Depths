// import KnightGif from "../../../public/Knight-with-pause-4fps.gif";

function Player({
  hp,
  maxHp,
  isRunningAway,
  isEA,
  isPA,
  poisonNum,
  hasRevived,
}) {
  return (
    <div
      className={
        hp <= 0
          ? "playerChar-container player-dead"
          : isRunningAway
            ? "playerChar-container player-run-away"
            : "playerChar-container"
      }
    >
      <div
        className={
          isEA[0] || isEA[1] || isEA[2]
            ? "playerChar beingDamaged"
            : isPA[0] || isPA[1] || isPA[2]
              ? "playerChar isAttacking"
              : "playerChar"
        }
      >
        {hasRevived ? <span className="halo" /> : null}
        <span className={!isRunningAway ? "playerHP" : "playerHP run-away"}>
          <span
            className={
              hp > maxHp * 0.2 ? "current-player-hp" : "current-player-hp low"
            }
          >
            {hp}
          </span>{" "}
          / {maxHp}
        </span>
        <section
          className={
            !isRunningAway
              ? "player-status-section"
              : "player-status-section run-away"
          }
        >
          {poisonNum > 0 ? (
            <div className="deBuffed-info">
              {poisonNum} <span className="icon16x16 poison" />
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default Player;
