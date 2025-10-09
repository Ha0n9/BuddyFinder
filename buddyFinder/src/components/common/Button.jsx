// Button.jsx
function Button({ children, onClick, disabled, className = "", type = "button" }) {
  const baseClasses = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-all";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className || baseClasses}
    >
      {children}
    </button>
  );
}

export default Button;