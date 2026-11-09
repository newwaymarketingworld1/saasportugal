import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        brand: {
          DEFAULT: "#FFD600",
          dark: "#E6C000",
          soft: "#FFF6BF",
        },
        line: "#E5E5E5",
        mute: "#6B6B6B",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        display: ["Azonix", "var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wordmark: "0.14em",
        widest2: "0.32em",
      },
    },
  },
  plugins: [],
};

export default config;
