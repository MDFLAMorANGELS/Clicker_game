import { useState, useEffect } from "react";
import { Button } from "@/components/button";

export default function App() {
  const [total, setTotal] = useState(0.0);
  const [perClick, setPerClick] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(10);
  const [autoClickers, setAutoClickers] = useState([]); // Tableau d'auto-clickers
  const [autoClickerBaseCost, setAutoClickerBaseCost] = useState(50); // Coût de base du premier auto-clicker
  const [autoClicker2BaseCost, setAutoClicker2BaseCost] = useState(1000); // Coût de base du deuxième auto-clicker
  const [autoClickerLevels, setAutoClickerLevels] = useState([]); // Tableau pour suivre le niveau de chaque auto-clicker

  useEffect(() => {
    const interval = setInterval(() => {
      // Calcule la somme des points générés par tous les auto-clickers
      const pointsFromAutoClickers = autoClickers.reduce(
        (acc, clicker, index) => acc + clicker.rate * autoClickerLevels[index],
        0
      );
      setTotal((prev) => prev + pointsFromAutoClickers);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers, autoClickerLevels]);

  useEffect(() => {
    const updateTitle = () => {
      document.title = `${total} Points Factory Clicker`;
    };

    document.addEventListener("visibilitychange", updateTitle);
    updateTitle();

    return () => {
      document.removeEventListener("visibilitychange", updateTitle);
    };
  }, [total]);

  const handleClick = () => {
    setTotal((prev) => prev + perClick);
  };

  const buyUpgrade = () => {
    if (total >= upgradeCost) {
      setTotal((prev) => prev - upgradeCost);
      setPerClick((prev) => prev + 100);
      setUpgradeCost((prev) => Math.ceil(prev * 1.5));
    }
  };

  const handleAutoClickerPurchaseOrUpgrade = (autoClickerId, rate, baseCost) => {
    // Vérifie si l'auto-clicker a été acheté
    const clickerIndex = autoClickers.findIndex((clicker) => clicker.id === autoClickerId);

    if (clickerIndex === -1) {
      // Acheter un Auto Clicker
      const newClicker = {
        id: autoClickerId,
        rate: rate, // Taux de production spécifique
        cost: baseCost,
      };

      if (total >= newClicker.cost) {
        // Soustraire le coût de l'achat des points avant de mettre à jour
        setTotal((prev) => prev - newClicker.cost);
        setAutoClickers((prev) => [...prev, newClicker]);
        setAutoClickerLevels((prev) => [...prev, 1]); // Ajouter le premier niveau pour cet auto-clicker
        if (baseCost === autoClickerBaseCost) {
          setAutoClickerBaseCost((prev) => Math.ceil(prev * 1.8)); // Le coût des auto-clickers de type 1 augmente
        } else {
          setAutoClicker2BaseCost((prev) => Math.ceil(prev * 1.8)); // Le coût des auto-clickers de type 2 augmente
        }
      }
    } else {
      // Mettre à niveau un Auto Clicker existant
      const currentClickerCost = autoClickers[clickerIndex]?.cost;

      // Assurez-vous de vérifier que le total est suffisant pour l'upgrade
      if (total >= currentClickerCost) {
        // Soustraire le coût de l'upgrade des points
        setTotal((prev) => prev - currentClickerCost);

        // Mettre à jour les niveaux de l'auto-clicker
        const newLevels = [...autoClickerLevels];
        newLevels[clickerIndex] += 1;
        setAutoClickerLevels(newLevels);

        // Augmenter le taux de production de l'auto-clicker
        const updatedClickers = [...autoClickers];
        updatedClickers[clickerIndex].rate += 1;
        setAutoClickers(updatedClickers);

        // Mettre à jour le coût de l'auto-clicker pour l'upgrade suivant
        const updatedCost = Math.ceil(updatedClickers[clickerIndex].cost * 1.5);
        updatedClickers[clickerIndex].cost = updatedCost;
        setAutoClickers(updatedClickers);
      }
    }
  };

  // Calcul des points générés automatiquement par seconde
  const pointsPerSecond = autoClickers.reduce(
    (acc, clicker, index) => acc + clicker.rate * autoClickerLevels[index],
    0
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-yellow-400">
      <h1 className="text-6xl font-bold mb-4 drop-shadow-xl">
        Factory Clicker
      </h1>
      <p className="text-lg mb-2">Total Points: {total}</p>
      <p className="text-lg mb-2">Points per second: {pointsPerSecond}</p> {/* Affichage des points générés par seconde */}
      <div className="p-4 mb-4 w-64 text-center">
        <Button className="w-full" onClick={handleClick}>
          Click here (+{perClick})
        </Button>
      </div>
      <div className="p-4 w-64 text-center">
        <Button
          className="w-full"
          onClick={buyUpgrade}
          disabled={total < upgradeCost}
        >
          Upgrade Click (+1) - Cost: {upgradeCost}
        </Button>
      </div>

      {/* Auto Clicker 1 */}
      <div className="p-4 w-64 text-center mt-4">
        <Button
          className="w-full"
          onClick={() => handleAutoClickerPurchaseOrUpgrade(1, 1, autoClickerBaseCost)}
          disabled={total < (autoClickers.find((clicker) => clicker.id === 1)?.cost || autoClickerBaseCost)}
        >
          {autoClickers.find((clicker) => clicker.id === 1)
            ? `Upgrade Auto Clicker 1 (Level: ${autoClickerLevels[autoClickers.findIndex((clicker) => clicker.id === 1)]}) - ${autoClickers.find((clicker) => clicker.id === 1)?.rate * autoClickerLevels[autoClickers.findIndex((clicker) => clicker.id === 1)]} points/s - Cost: ${autoClickers.find((clicker) => clicker.id === 1)?.cost}`
            : `Buy Auto Clicker 1 (+1/s) - Cost: ${autoClickerBaseCost}`}
        </Button>
      </div>

      {/* Auto Clicker 2 */}
      <div className="p-4 w-64 text-center mt-4">
        <Button
          className="w-full"
          onClick={() => handleAutoClickerPurchaseOrUpgrade(2, 5, autoClicker2BaseCost)}
          disabled={total < (autoClickers.find((clicker) => clicker.id === 2)?.cost || autoClicker2BaseCost)}
        >
          {autoClickers.find((clicker) => clicker.id === 2)
            ? `Upgrade Auto Clicker 2 (Level: ${autoClickerLevels[autoClickers.findIndex((clicker) => clicker.id === 2)]})  - ${autoClickers.find((clicker) => clicker.id === 2)?.rate * autoClickerLevels[autoClickers.findIndex((clicker) => clicker.id === 2)]} points/s - Cost: ${autoClickers.find((clicker) => clicker.id === 2)?.cost}`
            : `Buy Auto Clicker 2 (+5/s) - Cost: ${autoClicker2BaseCost}`}
        </Button>
      </div>
    </div>
  );
}
