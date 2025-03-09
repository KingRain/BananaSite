import React from "react";

export default function CongratsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-900 text-white">
      <h1 className="text-4xl font-bold">🎉 Congratulations! 🎉</h1>
      <p className="text-lg mt-2">You have successfully logged in.</p>
      <button
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded shadow"
        onClick={() => window.location.href = "/"}
      >
        Go Back
      </button>
    </div>
  );
}
