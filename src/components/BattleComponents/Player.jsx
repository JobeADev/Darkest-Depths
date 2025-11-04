// import KnightGif from "../../../public/Knight-with-pause-4fps.gif";

function Player({
  hp,
  maxHp,
  isRunningAway,
  isEA,
  isPA,
  regenNum,
  poisonNum,
  bleedNum,
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
          <div className="player-status-section-container">
            {regenNum > 0 ? (
              <div className="buffed-info">
                {regenNum}{" "}
                <span
                  className={
                    poisonNum > 0 || bleedNum > 0
                      ? "status-spacer icon16x16 regen"
                      : "icon16x16 regen"
                  }
                />
                <p className="status_name">HP Regen</p>
              </div>
            ) : null}
            {poisonNum > 0 ? (
              <div className="deBuffed-info">
                {poisonNum}{" "}
                <span
                  className={
                    bleedNum === 0
                      ? "icon16x16 poison"
                      : "status-spacer icon16x16 poison"
                  }
                />
                <p className="status_name">Poison</p>
              </div>
            ) : null}
            {bleedNum > 0 ? (
              <div className="deBuffed-info">
                {bleedNum} <span className="icon16x16 bleed" />
                <p className="status_name">Bleed</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Player;
