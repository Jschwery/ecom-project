const themeColors = {
  co1: "hsl(90, 40%, 92%)",
  ca1: "hsl(90, 40%, 92%)",
  co2: "hsl(90, 31%, 79%)",
  ca2: "hsl(90, 40%, 82%)",
  co3: "hsl(90, 27%, 69%)",
  ca3: "hsl(90, 40%, 72%)",
  co4: "hsl(90, 19%, 56%)",
  ca4: "hsl(90, 40%, 62%)",
  co5: "hsl(90, 20%, 47%)",
  ca5: "hsl(90, 40%, 52%)",
  co6: "hsl(90, 29%, 34%)",
  ca6: "hsl(90, 40%, 42%)",
  ca7: "hsl(90, 40%, 30%)",
  ca8: "hsl(90, 40%, 20%)",
  ca9: "hsl(90, 40%, 9%)",
  success: "#28A745",
  error: "#DC3545",
  warning: "#FFC107",
};
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      colors: themeColors,
    },
  },
  variants: {},
  plugins: [],
};
