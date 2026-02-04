/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'slate': {
          950: '#020617',
        },
        'coral': {
          400: '#ff7c5c',
          500: '#ff6b4a',
        },
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'fadeInUp': 'fadeInUp 0.8s ease forwards',
        'bounce': 'bounce 2s infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}