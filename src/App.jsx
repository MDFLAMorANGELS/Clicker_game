import { useState, useEffect } from "react";
import AutoClicker from "@/components/AutoClicker";
import Chaudron from "./Chaudron";
import Fire from "./Fire";
import "./Fire.css";
import potion from "@/assets/image/potion.png";
import { loadGame } from "./utils/saveManager.js";
import autoClickerTypes from "./data/autoClikerTypes";
import {
  playRandomClickSound,
  playRandomBuySound,
} from "./assets/sound/sounds";

export default function App() {
  const [total, setTotal] = useState(0);
  const [perClick, setPerClick] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(10);
  const [autoClickers, setAutoClickers] = useState([]);
  const [autoClickerLevels, setAutoClickerLevels] = useState([]);
  const [, setClickUpgradeLevel] = useState(0);
  const [clickEffects, setClickEffects] = useState([]);

  useEffect(() => {
    console.log("Chargement du jeu au montage");
    loadGame(setTotal, setAutoClickers, setAutoClickerLevels);
  }, []); // Chargement des données du jeux

  const saveGameTotal = (newTotal) => {
    const savedState = localStorage.getItem("autoClickerGameState");

    if (savedState) {
      const gameState = JSON.parse(savedState);
      gameState.total = newTotal;
      localStorage.setItem("autoClickerGameState", JSON.stringify(gameState));
    } else {
      console.log(
        "Aucune donnée trouvée dans localStorage pour l'état du jeu."
      );
    }
  };

  useEffect(() => {
    if (total !== 0) {
      saveGameTotal(total);
    }
  }, [total]);

  useEffect(() => {
    const interval = setInterval(() => {
      const pointsFromAutoClickers = autoClickers.reduce(
        (acc, clicker, index) => acc + clicker.rate * autoClickerLevels[index],
        0
      );
      setTotal((prev) => Math.round((prev + pointsFromAutoClickers) * 10) / 10);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers, autoClickerLevels]);

  useEffect(() => {
    document.title = `${total} Potion | Factory Clicker`;
  }, [total]);

  // Gestion du clic sur le chaudron
  const handleClickOnCauldron = (event) => {
    setTotal((prev) => Math.round((prev + perClick) * 10) / 10);
    playRandomClickSound();

    const { clientX, clientY } = event;

    const newEffect = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      value: perClick,
    };
    setClickEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setClickEffects((prev) =>
        prev.filter((effect) => effect.id !== newEffect.id)
      );
    }, 1500);
  };

  const buyUpgrade = () => {
    if (total >= upgradeCost) {
      setTotal((prev) => Math.round((prev - upgradeCost) * 10) / 10);
      setPerClick((prev) => prev + 100); // Augmenter le clic de 100 par upgrade
      setUpgradeCost((prev) => Math.ceil(prev * 1.5));
      setClickUpgradeLevel((prev) => prev + 1);
    }
  };

  const pointsPerSecond =
    Math.round(
      autoClickers.reduce(
        (acc, clicker, index) => acc + clicker.rate * autoClickerLevels[index],
        0
      ) * 10
    ) / 10;

  return (
    <div className="flex items-center justify-between min-h-screen border-r-gray-600">
      <div className="flex flex-col items-center justify-around w-1/3 h-[100vh] bg-gray-700">
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold drop-shadow-xl bg-gray-800 p-2 w-3/4 text-center mb-3 rounded-2xl">
            Potion Clicker
          </h1>
          <div className="bg-gray-800 w-full pt-3 pb-1">
            <p className="text-xl mb-2 leading-3">
              {Math.floor(total)} Potions
            </p>
            <p className="text-sm mb-2 leading-3">
              per second: {pointsPerSecond}
            </p>
          </div>
        </div>

        <div className="text-center flex flex-col items-center">
          <Chaudron handleClickOnCauldron={handleClickOnCauldron} />
          <Fire />
          <div className="absolute top-0 left-0 pointer-events-none">
            {clickEffects.map((effect) => (
              <div
                className="absolute text-green-400 font-extrabold text-shadows text-xl animate-fadeUp flex"
                key={effect.id}
                style={{ top: effect.y, left: effect.x }}
              >
                <img src={potion} alt="potion" className="h-[20px]" />
                <span>+{effect.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col  items-center w-72 pt-4 h-[100vh] bg-gray-700">
        <h2 className="text-3xl font-bold mb-4 drop-shadow-xl text-center">
          Boutique
        </h2>
        <div className="w-full">
          <p className="text-left">Amelioration</p>

          <button
            className=" flex items-center w-full p-3 rounded bg-slate-400 text-white border-4 border-slate-500"
            onClick={() => {
              if (total >= upgradeCost) {
                buyUpgrade();
                playRandomBuySound();
              }
            }}
            disabled={total < upgradeCost}
          >
            {/* Upgrade Click (+100) - Level: {clickUpgradeLevel} - Cost:{" "}
                {upgradeCost} */}
            <p className="">Curseur</p>
          </button>
        </div>

        <div className="w-full ">
          <p className="text-left">Construction</p>

          {autoClickerTypes.map((clicker) => (
            <AutoClicker
              key={clicker.id}
              id={clicker.id}
              rate={clicker.rate}
              baseCost={clicker.baseCost}
              image={clicker.image}
              name={clicker.name}
              description={clicker.description}
              total={total}
              setTotal={setTotal}
              autoClickers={autoClickers}
              setAutoClickers={setAutoClickers}
              autoClickerLevels={autoClickerLevels}
              setAutoClickerLevels={setAutoClickerLevels}
              playRandomBuySound={playRandomBuySound}
              pointsPerSecond={pointsPerSecond}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
