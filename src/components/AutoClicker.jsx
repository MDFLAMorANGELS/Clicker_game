import { useState, useEffect } from "react";
import potion from "@/assets/image/potion.png";
import unknow from "@/assets/image/unknow.png";
import { saveGame } from "../utils/saveManager.js";

const AutoClicker = ({
  id,
  rate,
  baseCost,
  image,
  name,
  description,
  total,
  setTotal,
  autoClickers,
  setAutoClickers,
  autoClickerLevels,
  setAutoClickerLevels,
  playRandomBuySound,
  pointsPerSecond,
}) => {
  const [hovered, setHovered] = useState(false);
  const [totalProduction, setTotalProduction] = useState(0);

  const clickerIndex = autoClickers.findIndex((clicker) => clicker.id === id);
  const clicker = autoClickers[clickerIndex];
  const level = clicker ? autoClickerLevels[clickerIndex] : 0;
  const productionAutoClicker =
    Math.round(rate * (autoClickerLevels[clickerIndex] || 0) * 10) / 10;

  const currentCost = clicker
    ? Math.ceil(baseCost * Math.pow(1.15, level))
    : baseCost;

  const handlePurchaseOrUpgrade = () => {
    if (total < currentCost) return;

    console.log("Avant achat:", { total, autoClickers, autoClickerLevels });

    const newTotal = Math.round((total - currentCost) * 10) / 10;
    let updatedClickers = [...autoClickers];
    let updatedLevels = [...autoClickerLevels];

    if (clickerIndex === -1) {
      updatedClickers = [...autoClickers, { id, rate, cost: currentCost }];
      updatedLevels = [...autoClickerLevels, 1];
    } else {
      updatedLevels[clickerIndex] += 1;
      updatedClickers[clickerIndex] = {
        ...clicker,
        rate: rate,
        cost: Math.ceil(baseCost * Math.pow(1.15, updatedLevels[clickerIndex])),
      };
    }

    setTotal(newTotal);
    setAutoClickers(updatedClickers);
    setAutoClickerLevels(updatedLevels);
    playRandomBuySound();

    console.log("Après achat:", {
      total: newTotal,
      autoClickers: updatedClickers,
      autoClickerLevels: updatedLevels,
    });

    saveGame(newTotal, updatedClickers, updatedLevels);
  };

  const isLocked = level === 0 && total < currentCost;
  const displayName = isLocked ? "???" : name;

  useEffect(() => {
    if (level > 0) {
      const interval = setInterval(() => {
        setTotalProduction(
          (prev) => Math.round((prev + productionAutoClicker) * 10) / 10
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [level, productionAutoClicker]);

  return (
    <div
      className="relative flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered &&
        (level === 0 && total < currentCost ? (
          <div className="absolute left-[-300px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded shadow-lg w-[300px] z-10 text-xs flex flex-col">
            <div className="flex justify-between">
              <div className="flex">
                <img src={unknow} alt="" className="w-[50px] h-[50px]  mr-1" />
                <div>
                  <p className="text-sm text-shadows">???</p>
                  <p className="bg-white text-black p-1 rounded">possedé : 0</p>
                </div>
              </div>
              <div className="flex justify-center">
                <img src={potion} alt="" className="w-[20px] h-[20px]" />
                <p className="text-sm">{currentCost}</p>
              </div>
            </div>
            <p className="text-right">"???"</p>
          </div>
        ) : (
          <div className="absolute left-[-300px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded shadow-lg w-[300px] z-10 text-xs flex flex-col">
            <div className="flex justify-between">
              <div className="flex">
                {image}
                <div>
                  <p className="text-sm text-shadows">{name}</p>
                  <p className="bg-white text-black p-1 rounded">
                    possedé : {level}
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <img src={potion} alt="" className="w-[20px] h-[20px]" />
                <p className="text-sm">{currentCost}</p>
              </div>
            </div>
            <p className="text-right my-1">"{description}"</p>

            {level > 0 && (
              <ul className="text-left list-disc mt-2 pl-5">
                <li>
                  Chaque {name} produit {rate} /s
                </li>
                <li>
                  {level} {name} produisant {productionAutoClicker} /s (
                  {((productionAutoClicker / pointsPerSecond) * 100).toFixed(2)}
                  % des Cps totaux)
                </li>
                <li>{Math.floor(totalProduction)} produits jusqu'à present</li>
              </ul>
            )}
          </div>
        ))}

      <button
        className={`flex items-center justify-between w-72 px-1 rounded text-shadows tracking-tighter border-4 
                transition-all duration-200 ease-in-out 
                ${
                  isLocked
                    ? "bg-gray-600 border-gray-700 opacity-50"
                    : "bg-zinc-400 border-zinc-500 hover:brightness-125 hover:shadow-[0_0_15px_#ffffff88]"
                }
                text-white`}
        onClick={handlePurchaseOrUpgrade}
        disabled={total < currentCost}
      >
        <div className="relative flex items-center">
          <div
            className={`w-[50px] h-[50px] flex items-center justify-center rounded ${
              isLocked ? "bg-black" : ""
            }`}
          >
            <div
              className={`w-[50px] h-[50px] flex items-center justify-center ${
                isLocked ? "grayscale opacity-15" : ""
              }`}
            >
              {image}
            </div>
          </div>

          <div className="flex-col ml-1">
            <p className="text-2xl font-bold">{displayName}</p>
            <div className="flex text-left items-center">
              <img src={potion} alt="" className="w-[20px] h-[20px]" />
              <p
                className={`${
                  total < currentCost ? "text-[#f66]" : "text-[#6f6]"
                } font-bold`}
              >
                {currentCost}
              </p>
            </div>
          </div>
        </div>
        {level > 0 && (
          <p className="text-3xl text-black opacity-40 font-light mr-1 mb-1">
            {level}
          </p>
        )}
      </button>
    </div>
  );
};

export default AutoClicker;
