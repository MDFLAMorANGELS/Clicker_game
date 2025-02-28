export const saveGame = (total, autoClickers, autoClickerLevels) => {
  const gameState = {
    total,
    autoClickers,
    autoClickerLevels,
  };

  console.log("Données sauvegardées :", gameState);
  localStorage.setItem("autoClickerGameState", JSON.stringify(gameState));
};

export const loadGame = (setTotal, setAutoClickers, setAutoClickerLevels) => {
  const savedState = localStorage.getItem("autoClickerGameState");

  if (savedState) {
    const { total, autoClickers, autoClickerLevels } = JSON.parse(savedState);
    console.log("Données autoClickers et autoClickerLevels chargées : ", {
      total,
      autoClickers,
      autoClickerLevels,
    });
    setTotal(total);
    setAutoClickers(autoClickers);
    setAutoClickerLevels(autoClickerLevels);
  } else {
    console.log("Aucune sauvegarde d'autoClickers trouvée");
  }
};

export const resetGame = (setTotal, setAutoClickers, setAutoClickerLevels) => {
  localStorage.removeItem("autoClickerGameState");
  setTotal(0);
  setAutoClickers([]);
  setAutoClickerLevels([]);
};
