/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        purple:{
          600:"#5046E4",
          400:"#8682E1"
        },
        gray:{
          200:"#E0E7FF",
          400:"#A9A9A9"
        },
        black:{
          600:"#000000"
        },
        white:{
          600:"#FFFFFF"
        }
      },
    },
  },
  plugins: [],
}