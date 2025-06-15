/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
      },
      colors: {
        'minecraft-green': '#4CAF50',
        'minecraft-dark-green': '#388E3C',
      },
    },
  },
  plugins: [],
};