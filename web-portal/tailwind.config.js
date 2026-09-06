/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          50: "#EEF2F7",
          100: "#D5DDE8",
          200: "#ADBBD1",
          300: "#8599BA",
          400: "#5D77A3",
          500: "#3A567D",
          600: "#2A4063",
          700: "#1D3050",
          800: "#152440",
          900: "#0F2440",
          950: "#091629",
        },
        gold: {
          50: "#FBF7EE",
          100: "#F5ECDA",
          200: "#EDDCB5",
          300: "#E0C88A",
          400: "#D4B46A",
          500: "#C6A664",
          600: "#B8973D",
          700: "#9A7D30",
          800: "#7C6426",
          900: "#5E4C1D",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
          subtle: "#F1F5F9",
          hover: "#E2E8F0",
        },
        status: {
          success: "#059669",
          warning: "#D97706",
          danger: "#DC2626",
          info: "#2563EB",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(198, 166, 100, 0.15)",
        "glow-lg": "0 0 40px rgba(198, 166, 100, 0.20)",
        card: "0 1px 3px rgba(15, 36, 64, 0.04), 0 4px 12px rgba(15, 36, 64, 0.06)",
        "card-hover": "0 4px 16px rgba(15, 36, 64, 0.08), 0 8px 32px rgba(15, 36, 64, 0.06)",
        elevated: "0 8px 30px rgba(15, 36, 64, 0.12)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
        modal: "0 25px 60px rgba(15, 36, 64, 0.25), 0 0 0 1px rgba(15, 36, 64, 0.05)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "progress-bar": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-up-fast": "slideUp 0.25s ease-out",
        "slide-left": "slideLeft 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "scale-in": "scaleIn 0.3s ease-out",
        "toast-in": "toast-in 0.4s ease-out",
        "progress-bar": "progress-bar 4s linear forwards",
      },
    },
  },
  plugins: [],
};
