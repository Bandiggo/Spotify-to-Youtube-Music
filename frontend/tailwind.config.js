// Update existing file
// in c:\Users\alisk\Desktop\Spotify-to-Youtube-Music\frontend\tailwind.config.js
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        light: {
        },
        dark: {
        }
      }
    })
  ],
  corePlugins: {
    preflight: false,
  }
};