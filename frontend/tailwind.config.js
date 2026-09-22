/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#e9f3fe',
        'navy-light': '#eef6fe',
        'navy-lighter': '#f7fbfe',
        'sidebar': '#e1edfc',
        'page-bg': '#f0f7fe',
        'card': '#f7fbfe',
        'card-alt': '#eef6fe',
        'border-soft': '#c9d8ee',
        'navy-text': '#0b1b46',
        'navy-secondary': '#173568',
        'ntro-blue': '#087cf0',
        'ntro-blue-soft': '#8ec5f8',
        'ntro-blue-icon': '#dceeff',
        'ntro-red': '#f23b4d',
        'ntro-red-soft': '#fde5e9',
        'ntro-amber': '#f59a13',
        'ntro-amber-soft': '#fff1d6',
        'ntro-green': '#16b86a',
        'ntro-green-soft': '#e2f7ed'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
