function Button({
  children,
  onClick,
  disabled,
  className = "",
  type = "button",
  variant = "primary", // 'primary' | 'secondary' | 'outline'
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl px-5 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5F00] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variantClasses = {
    // 🔥 Primary button - Nike orange, strong glow
    primary:
      "bg-[#FF5F00] text-black hover:bg-[#e95000] shadow-[0_4px_12px_rgba(255,95,0,0.3)] hover:shadow-[0_0_25px_rgba(255,95,0,0.6)] active:scale-95",

    // ⚫ Secondary - Dark surface with subtle orange hover
    secondary:
      "bg-[#1A1A1A] text-white border border-[#2A2A2A] hover:border-[#FF5F00] hover:text-[#FF5F00] hover:shadow-[0_0_20px_rgba(255,95,0,0.4)] active:scale-95",

    // 🟠 Outline - Transparent with orange border and glow on hover
    outline:
      "border-2 border-[#FF5F00] text-[#FF5F00] bg-transparent hover:bg-[#FF5F00] hover:text-black hover:shadow-[0_0_25px_rgba(255,95,0,0.6)] active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
