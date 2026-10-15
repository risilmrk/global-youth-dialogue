/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        gyde: {
          green: {
            DEFAULT: '#4851BA',
            dark: '#3B43A1',
            light: '#6366f1',
            subtle: 'rgba(72, 81, 186, 0.08)',
          },
          navy: {
            DEFAULT: '#000000',
            dark: '#000000',
            light: '#1e1b4b',
          },
          gold: {
            DEFAULT: '#9E59AC',
            light: '#c084fc',
            subtle: 'rgba(158, 89, 172, 0.1)',
          },
          crimson: '#8A1538',
          canvas: {
            light: '#F8FAFC',
            dark: '#05070e',
            cardDark: '#0e111d',
          },
        },
      },
      fontFamily: {
        serif: ['"Sora"', 'sans-serif'],
        arabic: ['"Cairo"', 'sans-serif'],
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
