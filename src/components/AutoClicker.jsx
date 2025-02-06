import { Button } from "@/components/button";

const AutoClicker = ({
  id,
  rate,
  baseCost,
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
  const currentCost = clicker ? Math.ceil(baseCost * Math.pow(1.5, level)) : baseCost;

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
        rate: rate, // Assurer que le taux reste fixe selon l'ID
        cost: Math.ceil(baseCost * Math.pow(1.5, updatedLevels[clickerIndex])),
      };

      setAutoClickers(updatedClickers);
      setAutoClickerLevels(updatedLevels);
    }
  };

  return (
    <div className="p-4 w-64 text-center mt-4">
      <Button className="w-full" onClick={handlePurchaseOrUpgrade} disabled={total < currentCost}>
        {clicker
          ? `Upgrade Auto Clicker ${id} (Lvl ${level}) - ${production} pts/s - Cost: ${currentCost}`
          : `Buy Auto Clicker ${id} (+${rate}/s) - Cost: ${baseCost}`}
      </Button>
    </div>
  );
};

export default AutoClicker;
