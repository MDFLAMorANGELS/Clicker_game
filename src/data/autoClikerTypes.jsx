import { Cursor } from "../Cursor";
import sorciere from "../assets/image/sorciere1.png";
import ferme from "../assets/image/ferme.png";
import mine from "../assets/image/mine.png";
import usine from "../assets/image/usine.png";

const autoClickerTypes = [
  {
    id: 1,
    rate: 0.1,
    baseCost: 15,
    image: <Cursor />,
    name: "Curseur",
    description: "Clique automatiquement",
  },
  {
    id: 2,
    rate: 2,
    baseCost: 30,
    image: <img src={sorciere} className="w-[50px] h-[50px] mr-1" />,
    name: "Sorcière",
    description: "Une sorcière pour préparer plus de potions",
  },
  {
    id: 3,
    rate: 30,
    baseCost: 60,
    image: <img src={ferme} className="w-[50px] h-[50px] mr-1" />,
    name: "Ferme",
    description: "Une ferme pour cultiver nos ingrédients",
  },
  {
    id: 4,
    rate: 40,
    baseCost: 120,
    image: <img src={mine} className="w-[50px] h-[50px] mr-1" />,
    name: "Mine",
  },
  {
    id: 5,
    rate: 50,
    baseCost: 240,
    image: <img src={usine} className="w-[50px] h-[50px] mr-1" />,
    name: "Usine",
  },
];

export default autoClickerTypes;
