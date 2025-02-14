import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import AutoClicker from "@/components/AutoClicker";
import Chaudron from "./Chaudron";
import clickb1 from "./assets/sound/clickb1.mp3";
import clickb2 from "./assets/sound/clickb2.mp3";
import clickb3 from "./assets/sound/clickb3.mp3";
import clickb4 from "./assets/sound/clickb4.mp3";
import clickb5 from "./assets/sound/clickb5.mp3";
import clickb6 from "./assets/sound/clickb6.mp3";
import clickb7 from "./assets/sound/clickb7.mp3";
import buy1 from "./assets/sound/buy1.mp3";
import buy2 from "./assets/sound/buy2.mp3";
import buy3 from "./assets/sound/buy3.mp3";
import buy4 from "./assets/sound/buy4.mp3";
import { Cursor } from "./Cursor";
import sorciere from "./assets/image/sorciere1.png";
import ferme from "./assets/image/ferme.png";
import mine from "./assets/image/mine.png";
import usine from "./assets/image/usine.png";
import potion from "@/assets/image/potion.png";

export default function App() {
  const [total, setTotal] = useState(0);
  const [perClick, setPerClick] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(10);
  const [autoClickers, setAutoClickers] = useState([]);
  const [autoClickerLevels, setAutoClickerLevels] = useState([]);
  const [, setClickUpgradeLevel] = useState(0);
  const [clickEffects, setClickEffects] = useState([]);
  const [unlockedAutoClickers, setUnlockedAutoClickers] = useState([]);


  const autoClickerTypes = [
    { id: 1, rate: 1, baseCost: 10, image: <Cursor />, name: "Curseur" },
    {
      id: 2,
      rate: 2,
      baseCost: 20,
      image: <img src={sorciere} className="w-[50px] h-[50px] " />,
      name: "Sorciere",
    },
    {
      id: 3,
      rate: 30,
      baseCost: 30,
      image: <img src={ferme} className="w-[50px] h-[50px]" />,
      name: "Ferme",
    },
    {
      id: 4,
      rate: 40,
      baseCost: 40,
      image: <img src={mine} className="w-[50px] h-[50px]" />,
      name: "Mine",
    },
    {
      id: 5,
      rate: 50,
      baseCost: 50,
      image: <img src={usine} className="w-[50px] h-[50px]" />,
      name: "Usine",
    },
  ];

  const playRandomClickSound = () => {
    const sounds = [
      clickb1,
      clickb2,
      clickb3,
      clickb4,
      clickb5,
      clickb6,
      clickb7,
    ];
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

  // Gestion du clic sur le chaudron
  const handleClickOnCauldron = (event) => {
    setTotal((prev) => prev + perClick);
    playRandomClickSound();

    // Obtenir la position du clic
    const { clientX, clientY } = event;

    // Ajouter un effet de texte temporaire
    const newEffect = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      value: perClick,
    };
    setClickEffects((prev) => [...prev, newEffect]);

    // Supprimer l'effet après 3 secondes
    setTimeout(() => {
      setClickEffects((prev) =>
        prev.filter((effect) => effect.id !== newEffect.id)
      );
    }, 1500);
  };

  const buyUpgrade = () => {
    if (total >= upgradeCost) {
      setTotal((prev) => prev - upgradeCost);
      setPerClick((prev) => prev + 100); // Augmenter le clic de 100 par upgrade
      setUpgradeCost((prev) => Math.ceil(prev * 1.5));
      setClickUpgradeLevel((prev) => prev + 1);
    }
  };

  const pointsPerSecond = autoClickers.reduce(
    (acc, clicker, index) => acc + clicker.rate * autoClickerLevels[index],
    0
  );

  return (
    <div className="flex items-center justify-between min-h-screen border-r-gray-600">
      <div className="flex flex-col items-center justify-center pt-12 pl-8 h-[100vh] bg-gray-700">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-xl">
          Factory Clicker
        </h1>
        <p className="text-lg mb-2">Total Points: {total}</p>
        <p className="text-lg mb-2">Points per second: {pointsPerSecond}</p>

        <div className="mb-4 text-center mt-12 justify-center flex">
          <Chaudron handleClickOnCauldron={handleClickOnCauldron} />
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

      <div className="flex flex-col  items-center w-72 pr-4 pt-4 h-[100vh] bg-gray-700">
        <h2 className="text-4xl font-bold mb-4 drop-shadow-xl text-center">
          Boutique
        </h2>
        <div className="w-full">
          <p className="text-left">Amelioration</p>
          <Button
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
          </Button>
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
      </div>
    </div>
  );
}
