import React, { useState, useEffect, useMemo } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function ThemeChatbot({ setThemeColors }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Default theme
  const defaultTheme = useMemo(() => ({
    primary: "#facc15",
    secondary: "#1e293b",
    other: "#64748b",
    bgcolour: "#1f2937",
    textcolour: "#f8fafc",
  }), []);

  const [themeColors, setTheme] = useState(defaultTheme);

  useEffect(() => {
    setThemeColors(defaultTheme);
  }, [setThemeColors, defaultTheme]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
      const prompt = `Based on the user's description, generate a **soothing website theme** with harmonious color tones.
      - The theme should be visually calming and suitable for web design.
      - Pay attention to any specific colors mentioned by the user and incorporate them into the theme.
      - Consider the user's emotions or feelings when selecting colors (e.g., calm, energetic, peaceful, etc.).
      - Return **ONLY** a JSON object with five HEX color codes:
        - primary (Main accent color)
        - secondary (Supporting color)
        - other (Neutral tone)
        - bgcolour (Background color)
        - textcolour (Text color that ensures high readability against the background - maintain at least WCAG AA contrast ratio)
      
      **User's theme description:** "${input}"

      **Example JSON output:**
      {
        "primary": "#a3d9ff",
        "secondary": "#ffbb99",
        "other": "#ccddee",
        "bgcolour": "#222831",
        "textcolour": "#e6e6e6"
      }`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

      let newTheme;
      try {
        newTheme = JSON.parse(responseText);
      } catch (e) {
        console.error("Invalid JSON response:"+e, responseText);
        newTheme = defaultTheme;
      }

      setTheme(newTheme);
      setThemeColors(newTheme);

      setMessages((prev) => [...prev, { text: "Here's your soothing theme!", sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching theme:", error);
      setMessages((prev) => [...prev, { text: "Oops! Something went wrong.", sender: "bot" }]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="fixed top-4 right-4 w-64 rounded-2xl shadow-lg z-50" style={{ backgroundColor: themeColors.bgcolour, color: themeColors.textcolour }}>
      <div
        className="p-3 flex items-center justify-between cursor-pointer rounded-2xl"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{ backgroundColor: themeColors.primary, color: themeColors.bgcolour }}
      >
        <span className="font-bold">Wanna Change Theme?</span>
        <FaRobot />
      </div>

      {open && (
        <div className="p-3 space-y-2">
          <div className="h-40 overflow-y-auto p-2 rounded-md" style={{ backgroundColor: themeColors.secondary }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md ${msg.sender === "user" ? "ml-auto" : ""} w-fit max-w-[75%] mb-2`}
                style={msg.sender === "user" ? { backgroundColor: themeColors.primary, color: themeColors.bgcolour } : { backgroundColor: themeColors.other, color: themeColors.textcolour }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 rounded-md"
              placeholder="Describe your theme..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ backgroundColor: themeColors.secondary, color: themeColors.textcolour }}
            />
            <button
              className="p-2 rounded-md hover:opacity-90"
              onClick={sendMessage}
              disabled={loading}
              style={{ backgroundColor: themeColors.primary, color: themeColors.bgcolour }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
