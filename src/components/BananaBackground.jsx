// components/BananaBackground.jsx
import React, { useState, useEffect } from "react";
import bananaSVG from "../assets/banana-bg-icon.svg"; // Adjust the path if needed

export default function BananaBackground() {
  const [dimensions, setDimensions] = useState({ rows: 20, cols: 20 });

  useEffect(() => {
    // Calculate how many bananas needed to fill the screen
    const calculateDimensions = () => {
      const bananaSize = 16; // 12px + 2px margin on each side
      const rows = Math.ceil(window.innerHeight / bananaSize) + 5; // Add extra for safety
      const cols = Math.ceil(window.innerWidth / bananaSize) + 5;
      setDimensions({ rows, cols });
    };

    // Calculate on mount and when window resizes
    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      <div className="animate-banana-move flex flex-wrap w-[200%] h-[200%] opacity-20">
        {[...Array(dimensions.rows)].map((_, row) => (
          <div key={row} className="flex w-full">
            {[...Array(dimensions.cols)].map((_, col) => (
              <img
                key={col}
                src={bananaSVG}
                alt="banana"
                className="w-12 h-12 m-2"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
