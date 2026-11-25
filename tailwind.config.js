/** @type {import('tailwindcss').Config} */
// نفس إعدادات الألوان والخطوط التي كانت داخل Tailwind CDN، لكن تُبنى محلياً
module.exports = {
  content: ['./www/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Thmanyah Sans"', 'system-ui', 'sans-serif'],
        display: ['"Thmanyah Serif Display"', '"Thmanyah Sans"', 'serif'],
        serifText: ['"Thmanyah Serif Text"', '"Thmanyah Sans"', 'serif'],
      },
      colors: {
        canvas: '#F6F7F5',
        primary: {
          DEFAULT: '#0F6A4F',
          dark: '#0A4D39',
          light: '#E7F3EE',
        },
        accent: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        },
      },
    },
  },
  plugins: [],
};
