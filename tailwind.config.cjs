/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.tsx"],
  theme: {
    extend: {
      animation: {
        "scale-x": "scale-x 1s linear 1",
      },
      keyframes: {
        "scale-x": {
          "0%": { transform: "scaleX(0%)" },
          "100%": { transform: "scaleX(100%)" },
        },
      },
    },
  },
};
