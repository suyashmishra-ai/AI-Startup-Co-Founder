/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0E1524',
        'ink-2': '#131C30',
        surface: '#16203A',
        line: '#2A3A5C',
        cyan: '#4FD1C5',
        gold: '#E0A458',
        paper: '#ECE9E1',
        'paper-dim': '#A9B2C4',
        coral: '#E2725B',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
