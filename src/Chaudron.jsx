import React, { useState } from "react";
import chaudron from "./assets/image/chaudron2.png";

const Chaudron = ({ handleClickOnCauldron }) => {
  const [isZooming, setIsZooming] = useState(false);

  const handleClick = (event) => {
    handleClickOnCauldron(event);
    setIsZooming(true); 
  
    setTimeout(() => {
      setIsZooming(false); 
    }, 300);
  };

  

  return (
    <div className="relative flex justify-center items-center overflow-visible ">
      <div className="cauldron-image-container">
        <img 
          className={`chaudron-img ${isZooming ? "zooming" : ""}`} 
          src={chaudron} 
          alt="Chaudron" 
          draggable="false" 
          onClick={handleClick}
        />
      </div>

      {/* Fumée animée */}
      <div className="smoke-container">
        <div className="smoke"></div>
        <div className="smoke delay"></div>
        <div className="smoke delay2"></div>
      </div>
    </div>
  );
};

export default Chaudron;
