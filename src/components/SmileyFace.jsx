import React from "react";

export default function SmileyFace({ mood }) {
  const getFace = () => {
    switch (mood) {
      case "happy":
        return "😃";
      case "angry":
        return "😠";
      case "sad":
      default:
        return "😢";
    }
  };

  return (
    <div className="w-48 h-48 bg-transparent flex items-center justify-center rounded-md border-2 border-yellow-400 text-6xl">
      {getFace()}
    </div>
  );
}
