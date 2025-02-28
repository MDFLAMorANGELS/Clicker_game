import clickb1 from "./clickb1.mp3";
import clickb2 from "./clickb2.mp3";
import clickb3 from "./clickb3.mp3";
import clickb4 from "./clickb4.mp3";
import clickb5 from "./clickb5.mp3";
import clickb6 from "./clickb6.mp3";
import clickb7 from "./clickb7.mp3";

import buy1 from "./buy1.mp3";
import buy2 from "./buy2.mp3";
import buy3 from "./buy3.mp3";
import buy4 from "./buy4.mp3";

const clickSounds = [clickb1, clickb2, clickb3, clickb4, clickb5, clickb6, clickb7];

const buySounds = [buy1, buy2, buy3, buy4];

export const playRandomClickSound = () => {
  const randomSound = clickSounds[Math.floor(Math.random() * clickSounds.length)];
  const audioElement = new Audio(randomSound);
  audioElement.volume = 0.3;
  audioElement.play().catch((error) => console.error("Erreur de lecture audio:", error));
};

export const playRandomBuySound = () => {
  const randomSound = buySounds[Math.floor(Math.random() * buySounds.length)];
  const audioElement = new Audio(randomSound);
  audioElement.volume = 0.3;
  audioElement.play().catch((error) => console.error("Erreur de lecture audio:", error));
};
