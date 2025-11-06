function EnemyInfoButton({ hoveredEnemy, setHoveredEnemy, enemy, index }) {
  return (
    <button
      className={
        hoveredEnemy != enemy ? "toggle-info-btn" : "toggle-info-btn clicked"
      }
      onClick={() =>
        hoveredEnemy.name === enemy.name
          ? setHoveredEnemy({})
          : setHoveredEnemy(enemy)
      }
    >
      enemy #{index + 1} info
    </button>
  );
}

export default EnemyInfoButton;
