/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#1a1a1a",
      "light-black": "#333333",
      white: "#fff",
      grey: "#808080",
      "modal-bg": "rgba(128, 128, 128, 0.01)",
    },
    extend: {},
  },
  plugins: [],
};
