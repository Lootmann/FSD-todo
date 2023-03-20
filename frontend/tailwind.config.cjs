/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zinc: {
          850: "rgb(30 30 33)",
        },
      },
    },
  },
  plugins: [],
};
