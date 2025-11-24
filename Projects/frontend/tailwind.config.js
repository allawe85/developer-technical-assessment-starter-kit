/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // OHB Inspired Palette
        ohb: {
          gold: '#C5A059', // The branding gold
          dark: '#1A1A1A', // High contrast dark
          gray: '#F8F8F8', // Light background
          blue: '#1e3a8a', // Deep corporate blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}