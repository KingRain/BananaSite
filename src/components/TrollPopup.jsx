import React, { useEffect, useState, useRef, useCallback } from "react";

const images = [
  "https://cdn.discordapp.com/emojis/815939720608743474.gif", 
];

export default function TrollPopup({ onClose }) {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    // Set initial position and select an image only once on mount
    setPosition({
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
    });
    setSelectedImage(images[Math.floor(Math.random() * images.length)]);
  }, []);

  // Function that does nothing for fake buttons
  const handleFakeClose = () => {
    // Does nothing
  };

  const handleMouseDown = (e) => {
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    // Calculate new position
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;
    
    // Convert to viewport percentages
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    setPosition({
      left: `${(newLeft / viewportWidth) * 100}%`,
      top: `${(newTop / viewportHeight) * 100}%`,
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={popupRef}
      className="fixed bg-black/70 w-64 h-64 p-4 flex items-center justify-center rounded-lg border-2 border-yellow-400 shadow-lg cursor-move"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={handleMouseDown}
    >
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Troll"
          className="w-40 h-40 object-cover rounded-md"
          key={selectedImage} // Add a key to ensure the element isn't recreated
        />
      )}

      {/* Only top-left button works, others are fake */}
      <button
        className="absolute top-0 left-0 p-1 text-white rounded-bl-md text-xs"
        onClick={handleFakeClose}
      >
        ❌
      </button>
      <button
        className="absolute top-0 right-0 p-1 text-white rounded-br-md text-xs"
        onClick={handleFakeClose}
      >
        ❌
      </button>
      <button
        className="absolute bottom-0 left-0 p-1 text-white rounded-tl-md text-xs"
        onClick={handleFakeClose}
      >
        ❌
      </button>
      <button
        className="absolute bottom-0 right-0 p-1 text-white rounded-tr-md text-xs"
        onClick={onClose}
      >
        ❌
      </button>
    </div>
  );
}
