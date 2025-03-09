/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function DraggableBreakButton({ onSignIn, onBreak, installComplete }) {
  const [broken, setBroken] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [containerBounds, setContainerBounds] = useState({ bottom: 0, right: 0 });

  useEffect(() => {
    if (broken && !fixed) {
      const updateBounds = () => {
        setContainerBounds({
          bottom: window.innerHeight - 60,
          right: window.innerWidth - 80,
        });
      };
      
      updateBounds();
      window.addEventListener("resize", updateBounds);
      
      setPosition({
        x: Math.random() * (containerBounds.right - 100) - (containerBounds.right / 2),
        y: Math.random() * (containerBounds.bottom / 2),
      });
      
      return () => {
        window.removeEventListener("resize", updateBounds);
      };
    }
  }, [broken, fixed]);

  const handleBreak = () => {
    if (!broken) {
      setBroken(true);
      setFixed(false);
      if (onBreak) onBreak();
    }
  };

  const handleDragEnd = (_, info) => {
    const trackRect = containerRef.current.getBoundingClientRect();
    const buttonX = info.point.x;
    const buttonY = info.point.y;
    
    const isOverTrack =
      Math.abs(buttonX) < 60 &&
      Math.abs(buttonY - trackRect.top + window.scrollY) < 30;
    
    if (isOverTrack) {
      setFixed(true);
      setPosition({ x: 0, y: 0 });
    }
  };

  if (installComplete) {
    return (
      <div className="mt-6 flex flex-col items-center">
        <button
          className="w-64 h-12 bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer text-white font-bold shadow-lg focus:outline-none"
          onClick={() => alert("Installation successful!")}
          type="button"
          aria-label="Installation Complete"
        >
          🚀 Installed! Click to continue
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col items-center" ref={containerRef}>
      <div className="relative w-64 h-12 border-2 border-dashed border-gray-500 rounded-full flex items-center justify-center mb-2">
        {!broken && !fixed && (
          <>
            <button
              className="w-64 h-12 bg-yellow-500 rounded-lg flex items-center justify-center cursor-pointer text-black font-bold shadow-lg focus:outline-none"
              onClick={handleBreak}
              type="button"
              aria-label="Break button"
            ></button>
            <p className="absolute inset-0 flex items-center justify-center text-white font-semibold pointer-events-none">
              Click to Sign In
            </p>
          </>
        )}

        {fixed && (
          <motion.button
            className="w-20 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer text-black font-bold shadow-lg"
            onClick={() => {
              setBroken(false);
              onSignIn();
            }}
            type="button"
            aria-label="Fix and sign in"
          >
            ✔
          </motion.button>
        )}
      </div>

      {broken && !fixed && (
        <motion.button
          className="w-64 h-12 bg-red-500 rounded-full flex items-center justify-center cursor-pointer text-black font-bold shadow-lg absolute"
          drag
          dragMomentum={false}
          dragConstraints={{ top: 0, bottom: containerBounds.bottom * 0.8 }}
          initial={{ x: position.x, y: position.y }}
          animate={{ x: position.x, y: position.y }}
          onDragEnd={handleDragEnd}
          whileDrag={{ transition: { type: false } }}
          type="button"
          aria-label="Drag to fix"
        >
          💀
        </motion.button>
      )}

      {broken && !fixed && (
        <>
          <p className="mt-4 text-white text-sm">Whoops... Find another way.</p>
          <p className="mt-4 text-white text-sm">Maybe you don't have the right packages installed :p</p>
        </>
      )}
    </div>
  );
}
