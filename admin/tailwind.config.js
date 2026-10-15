/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gyde: {
          green: {
            DEFAULT: '#0E4D3C',
            dark: '#083226',
            light: '#136750',
          },
          navy: {
            DEFAULT: '#091D2C',
            dark: '#05111b',
            light: '#123046',
          },
          gold: {
            DEFAULT: '#B88E3E',
            light: '#E6C875',
          },
          crimson: '#8A1538',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        arabic: ['"Cairo"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
