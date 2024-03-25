/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#131215',
        box: '#1C1C1E',
        white: '#FEFEFF',
        btn: '#B5A1E3'
      }
    },
  },
  plugins: [],
}

