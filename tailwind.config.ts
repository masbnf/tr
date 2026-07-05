import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fff0f2",
          100: "#ffd6dc",
          200: "#ffadb8",
          300: "#ff7088",
          400: "#ff2244",
          500: "#e8002a",
          600: "#c50021",
          700: "#a20018",
          800: "#840014",
          900: "#6d0010",
        },
        navy: {
          50:  "#eef0f8",
          100: "#d5d8ed",
          200: "#abb2db",
          300: "#808bc9",
          400: "#5565b7",
          500: "#2b3fa5",
          600: "#1e2d8a",
          700: "#141f6b",
          800: "#0d1450",
          900: "#080d38",
        },
        accent: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        surface: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      backgroundImage: {
        "hero-gradient":    "linear-gradient(135deg, #e8002a 0%, #a20018 100%)",
        "card-gradient":    "linear-gradient(135deg, #e8002a 0%, #c50021 100%)",
        "accent-gradient":  "linear-gradient(135deg, #f97316 0%, #eab308 100%)",
      },
      boxShadow: {
        "glow-red":    "0 0 24px 0 rgba(232,0,42,0.38)",
        "glow-orange": "0 0 24px 0 rgba(249,115,22,0.30)",
        "card":        "0 2px 16px 0 rgba(15,23,42,0.08)",
        "card-hover":  "0 8px 32px 0 rgba(232,0,42,0.20)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease both",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "float":      "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
