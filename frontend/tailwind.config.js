/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#040d21',
        'navy-light': '#0a1930',
        'navy-lighter': '#112240',
        'ntro-blue': '#00a3ff',
        'ntro-red': '#ff3b30',
        'ntro-amber': '#ff9500',
        'ntro-green': '#34c759'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
