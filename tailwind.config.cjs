/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.tsx"],
  theme: {
    extend: {
      animation: {
        "fade-out": "fadeOut 0.25s ease-in-out",
      },
      keyframes: () => ({
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
