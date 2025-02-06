import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import AutoClicker from "@/components/AutoClicker";
import clickb1 from "./assets/clickb1.mp3";
import clickb2 from "./assets/clickb2.mp3";
import clickb3 from "./assets/clickb3.mp3";
import clickb4 from "./assets/clickb4.mp3";
import clickb5 from "./assets/clickb5.mp3";
import clickb6 from "./assets/clickb6.mp3";
import clickb7 from "./assets/clickb7.mp3";
import buy1 from "./assets/buy1.mp3";
import buy2 from "./assets/buy2.mp3";
import buy3 from "./assets/buy3.mp3";
import buy4 from "./assets/buy4.mp3";

export default function App() {
  const [total, setTotal] = useState(0);
  const [perClick, setPerClick] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(10);
  const [autoClickers, setAutoClickers] = useState([]);
  const [autoClickerLevels, setAutoClickerLevels] = useState([]);

  const autoClickerTypes = [
    { id: 1, rate: 1, baseCost: 50 },
    { id: 2, rate: 5, baseCost: 1000 },
    { id: 3, rate: 20, baseCost: 5000 },
    { id: 4, rate: 100, baseCost: 20000 },
  ];

  const playRandomClickSound = () => {
    const sounds = [clickb1, clickb2, clickb3, clickb4, clickb5, clickb6, clickb7, ];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

    const audioElement = new Audio(randomSound);
    audioElement.volume = 0.3;
    audioElement
      .play()
      .catch((error) => console.error("Erreur de lecture audio:", error));
  };

  const playRandomBuySound = () => {
    const sounds = [buy1, buy2, buy3, buy4];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

    const audioElement = new Audio(randomSound);
    audioElement.volume = 0.3;
    audioElement
      .play()
      .catch((error) => console.error("Erreur de lecture audio:", error));
  };

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
    document.title = `${total} Points | Factory Clicker`;
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

  const handleAutoClickerPurchaseOrUpgrade = (
    autoClickerId,
    rate,
    baseCost
  ) => {
    // Vérifie si l'auto-clicker a été acheté
    const clickerIndex = autoClickers.findIndex(
      (clicker) => clicker.id === autoClickerId
    );

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
      <p className="text-lg mb-2">Points per second: {pointsPerSecond}</p>

      <div className="p-4 mb-4 w-64 text-center">
        <Button
          className="w-full"
          onClick={() => {
            playRandomClickSound();
            handleClick();
          }}
        >
          Click here (+{perClick})
        </Button>
      </div>

      <div className="p-4 w-64 text-center">
        <Button
          className="w-full"
          onClick={() => {
            if (total >= upgradeCost) {
              buyUpgrade();
              playRandomBuySound();
            }
          }}
          disabled={total < upgradeCost}
        >
          Upgrade Click (+100) - Cost: {upgradeCost}
        </Button>
      </div>

      {/* Générer dynamiquement les AutoClickers */}
      {autoClickerTypes.map((clicker) => (
        <AutoClicker
          key={clicker.id}
          id={clicker.id}
          rate={clicker.rate}
          baseCost={clicker.baseCost}
          total={total}
          setTotal={setTotal}
          autoClickers={autoClickers}
          setAutoClickers={setAutoClickers}
          autoClickerLevels={autoClickerLevels}
          setAutoClickerLevels={setAutoClickerLevels}
          playRandomBuySound={playRandomBuySound}
        />
      ))}
    </div>
  );
}