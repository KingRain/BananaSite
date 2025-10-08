import React, { useState, useEffect, useMemo } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function ThemeChatbot({ setThemeColors, themeColors }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const defaultTheme = useMemo(() => ({
    primary: "#facc15",
    secondary: "#1e293b",
    other: "#64748b",
    bgcolour: "#1f2937",
    textcolour: "#f8fafc"
  }), []);

  // Use defaultTheme as fallback when themeColors is undefined
  const currentTheme = themeColors || defaultTheme;

  useEffect(() => {
    setThemeColors(defaultTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setThemeColors]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      const prompt = `Generate a **soothing website theme** with harmonious color tones based on the user's specific description. You must interpret the semantic meaning and visual appearance of what they describe to create appropriate colors.

**IMPORTANT COLOR GENERATION RULES:**
- If they mention an object (chicken, egg, sugar, etc.), use colors that match the typical appearance of that object
- If they mention nature (blue sky, ocean, forest), use colors inspired by those natural elements
- If they mention emotions or abstract concepts, choose colors that evoke those feelings
- Always create a harmonious, visually pleasing color palette suitable for web design

**SPECIFIC COLOR MAPPING EXAMPLES:**
- "chicken" → warm yellows, light browns, creamy whites
- "blue sky" → sky blues, light azure, soft cloud whites
- "sugar" → pure whites, light grays, subtle pastels
- "egg" → creamy whites, light browns, soft yellows
- "ocean" → deep blues, turquoise, sea greens
- "forest" → deep greens, earth browns, forest greens
- "sunset" → warm oranges, pinks, golden yellows
- "snow" → pure whites, light blues, soft grays

**COLOR PSYCHOLOGY CONSIDERATIONS:**
- Use warm colors (reds, oranges, yellows) for energetic, passionate themes
- Use cool colors (blues, greens, purples) for calm, peaceful themes
- Ensure high contrast between background and text for readability (WCAG AA compliant)

**User's theme description:** "${input}"

Return **ONLY** a JSON object with five HEX color codes:
- primary (Main accent color - should be the most prominent color from your interpretation)
- secondary (Supporting color - complementary to primary)
- other (Neutral tone - muted version for backgrounds/borders)
- bgcolour (Background color - main background, should contrast well with text)
- textcolour (Text color - high contrast against background, minimum WCAG AA ratio)

**Example JSON output:**
{
  "primary": "#f4d03f",
  "secondary": "#f7dc6f",
  "other": "#f8f9fa",
  "bgcolour": "#2c3e50",
  "textcolour": "#ecf0f1"
}`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      // Clean up markdown formatting from the response
      responseText = responseText
        .replace(/```json\s*/g, '')  // Remove ```json
        .replace(/```\s*/g, '')       // Remove ```
        .replace(/^\s*[\r\n]+/gm, '') // Remove leading newlines
        .trim();                      // Trim whitespace

      let newTheme;
      try {
        newTheme = JSON.parse(responseText);
      } catch (e) {
        console.error(`Error parsing JSON response from Gemini API: ${e.message}`, responseText);
        newTheme = defaultTheme;
      }

      // Validate that all required color properties exist in the response
      const requiredColors = ['primary', 'secondary', 'other', 'bgcolour', 'textcolour'];
      const missingColors = requiredColors.filter(color => !newTheme[color]);
      
      if (missingColors.length > 0) {
        console.warn(`Missing color properties: ${missingColors.join(', ')}. Using default theme.`);
        newTheme = defaultTheme;
      }

      setThemeColors(newTheme);
      setMessages((prev) => [...prev, { text: "Here's your soothing theme!", sender: "bot" }]);
    } catch (error) {
      console.error(`Error generating theme with Gemini API: ${error.message}`);
      setMessages((prev) => [...prev, { text: "Oops! Something went wrong.", sender: "bot" }]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="fixed top-4 right-4 w-64 rounded-2xl shadow-lg z-50" style={{ backgroundColor: currentTheme.bgcolour, color: currentTheme.textcolour }}>
      <div
        className="p-3 flex items-center justify-between cursor-pointer rounded-2xl"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{ backgroundColor: currentTheme.primary, color: currentTheme.bgcolour }}
      >
        <span className="font-bold">Wanna Change Theme?</span>
        <FaRobot />
      </div>

      {open && (
        <div className="p-3 space-y-2">
          <div className="h-40 overflow-y-auto p-2 rounded-md" style={{ backgroundColor: currentTheme.secondary }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md ${msg.sender === "user" ? "ml-auto" : ""} w-fit max-w-[75%] mb-2`}
                style={msg.sender === "user" ? { backgroundColor: currentTheme.primary, color: currentTheme.bgcolour } : { backgroundColor: currentTheme.other, color: currentTheme.textcolour }}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{ backgroundColor: currentTheme.secondary, color: currentTheme.textcolour }}
            />
            <button
              className="p-2 rounded-md hover:opacity-90"
              onClick={sendMessage}
              disabled={loading}
              style={{ backgroundColor: currentTheme.primary, color: currentTheme.bgcolour }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
