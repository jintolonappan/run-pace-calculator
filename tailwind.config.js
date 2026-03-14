/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fef4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#13ec5b',
          600: '#10c44c',
          700: '#0d9a3c',
          800: '#0a7830',
          900: '#075c24',
        },
        'bg-light':    '#f6f8f6',
        'bg-dark':     '#102216',
        'surf-dark':   '#1a3225',
        'border-dark': '#2a4535',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
