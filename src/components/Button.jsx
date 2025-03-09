export default function Button({ onClick, children }) {
    return (
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg transition-transform duration-200 hover:scale-105"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  