// tailwind.config.js — add these to extend
export const content = ["./src/**/*.{js,jsx}"];
export const theme = {
  extend: {
    fontFamily: {
      orbitron: ["Orbitron", "sans-serif"],
      exo: ["'Exo 2'", "sans-serif"],
    },
    keyframes: {
      floatUp: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-8px)" },
      },
      fadeSlideUp: {
        from: { opacity: "0", transform: "translateY(24px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
    },
    animation: {
      fadeSlideUp: "fadeSlideUp 0.6s ease forwards",
    },
  },
};
export const plugins = [];