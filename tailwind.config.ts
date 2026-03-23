import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: "#f4d7dd",
        maroon: "#731226",
        cream: "#fff8f0",
        beige: "#efe1d1",
        gold: "#c9a96e",
        rose: "#9d3047",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(115, 18, 38, 0.12)",
      },
      backgroundImage: {
        "hero-lux": "radial-gradient(circle at top, rgba(244,215,221,.65), transparent 40%), linear-gradient(135deg, #fff8f0 0%, #efe1d1 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
