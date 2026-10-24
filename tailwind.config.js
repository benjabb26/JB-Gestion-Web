/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#112842',
          dark: '#07192d',
          darker: '#051a32',
          light: '#1b3b61',
        },
        gold: {
          DEFAULT: '#af7e35',
          hover: '#8e6d23',
          light: '#b0892c',
          soft: '#fdfbf5',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
