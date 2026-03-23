/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1A3C6E',
        'accent-gold': '#C9A84C',
        'success-green': '#28A745',
        'warning-orange': '#FD7E14',
        'danger-red': '#DC3545',
        'background': '#F4F6FA',
        'card-white': '#FFFFFF',
        'text-dark': '#212529'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
