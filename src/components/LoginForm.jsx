import { useState, useEffect } from "react";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import SmileyFace from "../components/SmileyFace";
import SlideToUnlock from "./DraggableBreakButton";
import BananaEffect from "./BananaEffect"; // Import the BananaEffect component

export default function LoginForm({ themeColors }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [tilt, setTilt] = useState(false);
  const [shake, setShake] = useState(false);
  const [showBananas, setShowBananas] = useState(false); // Add state for banana effect

  useEffect(() => {
    if (formData.email.length > 3 || formData.password.length > 3) {
      setTilt(true);
      setTimeout(() => setTilt(false), 500);
    }
  }, [formData]);

  useEffect(() => {
    if (formData.email.length > 0 || formData.password.length > 0) {
      const interval = setInterval(() => {
        setShake(true);
        setTimeout(() => setShake(false), 200);
        setFormData((prev) => ({
          email: prev.email.length > 0 ? prev.email.slice(0, -1) : "",
          password: prev.password.length > 0 ? prev.password.slice(0, -1) : "",
        }));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getMood = () => {
    const { email, password } = formData;
    if (!email.trim() && !password.trim()) return "sad";
    if (!email.trim() || !password.trim()) return "angry";
    return "happy";
  };

  // Handle the slide completion
  const handleSlideComplete = () => {
    setShowBananas(true);
    // Reset banana effect after some time (optional)
    setTimeout(() => setShowBananas(false), 3000);
  };

  return (
    <div
      className="flex w-full max-w-4xl rounded-lg overflow-hidden"
      style={{ backgroundColor: themeColors.secondary }}
    >
      {/* Show banana effect when triggered */}
      {showBananas && <BananaEffect />}
      
      {/* Login Form */}
      <div
        className="w-2/3 p-8 border-r"
        style={{ borderColor: themeColors.primary }}
      >
        <h2 className="text-2xl font-semibold mb-6" style={{ color: themeColors.textcolour }}>
          Sign In
        </h2>

        <form className="space-y-4">
          <div className={`transition-transform duration-500 ${tilt ? "-rotate-6" : ""} ${shake ? "animate-shake" : ""}`}>
            <label className="block text-sm font-medium mb-1" style={{ color: themeColors.textcolour }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeColors.secondary,
                borderColor: themeColors.other,
                color: themeColors.textcolour,
              }}
            />
          </div>

          <div className={`transition-transform duration-500 ${tilt ? "-rotate-6" : ""} ${shake ? "animate-shake" : ""}`}>
            <label className="block text-sm font-medium mb-1" style={{ color: themeColors.textcolour }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeColors.secondary,
                borderColor: themeColors.other,
                color: themeColors.textcolour,
              }}
            />
          </div>
        </form>

        {/* Social Login */}
        <div className="mt-8">
          <div className="flex items-center">
            <div className="flex-grow h-px" style={{ backgroundColor: themeColors.other }}></div>
            <span className="px-3 text-sm" style={{ color: themeColors.textcolour }}>
              Or continue with
            </span>
            <div className="flex-grow h-px" style={{ backgroundColor: themeColors.other }}></div>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button className="p-2 rounded-full" style={{ backgroundColor: themeColors.secondary }}>
              <FaGoogle style={{ color: themeColors.primary }} className="text-xl" />
            </button>
            <button className="p-2 rounded-full" style={{ backgroundColor: themeColors.secondary }}>
              <FaFacebook style={{ color: themeColors.primary }} className="text-xl" />
            </button>
            <button className="p-2 rounded-full" style={{ backgroundColor: themeColors.secondary }}>
              <FaTwitter style={{ color: themeColors.primary }} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Slide to Sign In */}
        <div className="mt-6">
          <SlideToUnlock onComplete={handleSlideComplete} onBreak={() => setShowBananas(true)} />
        </div>
      </div>

      {/* Smiley Face Section */}
      <div className="w-1/3 p-8 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-3" style={{ color: themeColors.primary }}>
            How's it going?
          </h3>
          <p className="text-lg" style={{ color: themeColors.textcolour }}>
            Fill in your details or I'll stay sad forever! 🍌 No pressure!
          </p>
        </div>

        <div className="w-40 h-40">
          <SmileyFace mood={getMood()} />
        </div>
      </div>
    </div>
  );
}
