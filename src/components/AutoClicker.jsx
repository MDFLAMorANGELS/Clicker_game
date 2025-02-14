import potion from "@/assets/image/potion.png";
import { Button } from "./Button";

const AutoClicker = ({
  id,
  rate,
  baseCost,
  image,
  name,
  total,
  setTotal,
  autoClickers,
  setAutoClickers,
  autoClickerLevels,
  setAutoClickerLevels,
  playRandomBuySound,
}) => {
  const clickerIndex = autoClickers.findIndex((clicker) => clicker.id === id);
  const clicker = autoClickers[clickerIndex];
  const level = clicker ? autoClickerLevels[clickerIndex] : 0;
  const production = clicker ? clicker.rate * level : rate;
  const currentCost = clicker
    ? Math.ceil(baseCost * Math.pow(1.5, level))
    : baseCost;

  const handlePurchaseOrUpgrade = () => {
    if (total < currentCost) return;

    setTotal((prev) => prev - currentCost);
    playRandomBuySound();

    if (clickerIndex === -1) {
      // Acheter un nouvel auto-clicker
      setAutoClickers([...autoClickers, { id, rate, cost: currentCost }]);
      setAutoClickerLevels([...autoClickerLevels, 1]);
    } else {
      // Améliorer l'auto-clicker existant
      const updatedClickers = [...autoClickers];
      const updatedLevels = [...autoClickerLevels];

      updatedLevels[clickerIndex] += 1;
      updatedClickers[clickerIndex] = {
        ...clicker,
        rate: rate,
        cost: Math.ceil(baseCost * Math.pow(1.5, updatedLevels[clickerIndex])),
      };

      setAutoClickers(updatedClickers);
      setAutoClickerLevels(updatedLevels);
    }
  };

  // Vérifie si l'auto-clicker est verrouillé
  const isLocked = level === 0 && total < currentCost;
  const displayName = isLocked ? "???" : name;

  return (
    <Button
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
        {/* Fond noir pour l'image si l'auto-clicker est verrouillé */}
        <div
          className={`w-[50px] h-[50px] flex items-center justify-center rounded ${
            isLocked ? "bg-black" : ""
          }`}
        >
          {/* Image avec un filtre si verrouillé */}
          <div
            className={`w-[50px] h-[50px] flex items-center justify-center ${
              isLocked ? "grayscale opacity-15" : ""
            }`}
          >
            {image}
          </div>
        </div>

        <div className="flex-col ml-1">
          <p className="text-3xl font-bold">{displayName}</p>
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
        <p className="text-4xl text-black opacity-40 font-light mr-1">
          {level}
        </p>
      )}
    </Button>
  );
};

export default AutoClicker;
