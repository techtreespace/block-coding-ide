/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4DBA87',
        secondary: '#2C3E50',
        accent: '#E74C3C'
      }
    },
  },
  plugins: [],
}
