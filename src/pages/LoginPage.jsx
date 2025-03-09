import { useState } from "react";
import LoginForm from "../components/LoginForm";
import BananaBackground from "../components/BananaBackground";
import BananaEffect from "../components/BananaEffect";
import TerminalPopup from "../components/TerminalPopup";
import ThemeChatbot from "../components/ThemeChatbot";
import TrollPopup from "../components/TrollPopup";

export default function LoginPage() {
  const [spawnBananas, _setSpawnBananas] = useState(false);
  const [popups, setPopups] = useState([]);
  const [themeColors, setThemeColors] = useState({
    primary: "#facc15",
    secondary: "#1e293b",
    other: "#64748b",
    bgcolour: "#1f2937",
    textcolour: "#f8fafc",
  });

  const _spawnPopup = () => setPopups((prev) => [...prev, Math.random()]);
  const removePopup = (index) => setPopups((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="relative min-h-screen bg-transparent p-4 overflow-hidden" style={{ backgroundColor: themeColors.bgcolour, color: themeColors.textcolour }}>
      <BananaBackground />
      <div className="relative flex items-center justify-center min-h-[calc(100vh-2rem)] z-10">
        <h1 className="absolute top-10 text-4xl font-bold" style={{ color: themeColors.primary }}>
          🍌 Banana Login
        </h1>

        <LoginForm themeColors={themeColors} onThemeChange={setThemeColors} />

        {spawnBananas && <BananaEffect />}
        <TerminalPopup />
        <ThemeChatbot setThemeColors={setThemeColors} />

        {popups.map((id, index) => (
          <TrollPopup key={id} onClose={() => removePopup(index)} />
        ))}
      </div>
    </div>
  );
}
