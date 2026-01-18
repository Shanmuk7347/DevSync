/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Correctly looks for the "dark" class we added in App.js
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}" // Expanded to catch all possible file types
  ],
  theme: {
    extend: {
      // You can add custom brand colors here if needed
    },
  },
  plugins: [],
}