/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* === MODERN FITNESS – HIGH CONTRAST === */
        primary: {
          DEFAULT: "#0061F2",   // vivid blue
          hover: "#004ACC",
          light: "#5EB5FF",
        },
        secondary: {
          DEFAULT: "#00C37A",   // green energy
          hover: "#009E60",
          light: "#4DFABE",
        },
        accent: {
          DEFAULT: "#FF7A00",   // orange pop
          hover: "#E65F00",
          light: "#FFAC66",
        },

        /* === High Contrast Backgrounds === */
        background: {
          DEFAULT: "#1E293B",      // deep navy-gray
          secondary: "#2D3748",    // section block
          elevated: "#3B4457",     // subtle contrast layer
        },
        surface: {
          DEFAULT: "#FFFFFF",      // white cards
          hover: "#F7F9FB",
          elevated: "#F0F4F8",
        },

        /* === Text === */
        text: {
          primary: "#F9FAFB",      // bright white
          secondary: "#CBD5E1",    // soft gray
          inverse: "#1E293B",      // dark on light
        },

        /* === Status === */
        success: "#22C55E",
        warning: "#FACC15",
        error: "#EF4444",
        info: "#3B82F6",

        /* === Borders & Dividers === */
        border: {
          DEFAULT: "#334155",
          light: "#475569",
        },
        divider: "#3F4A59",
      },

      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.08)",
        md: "0 4px 8px rgba(0, 0, 0, 0.12)",
        lg: "0 8px 16px rgba(0, 0, 0, 0.18)",
        xl: "0 12px 24px rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px rgba(0, 97, 242, 0.4)",
      },

      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },

      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
