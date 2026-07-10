/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#F5F7F2',
        accent: '#4A7C59',
        'accent-hover': '#3A6347',
        'accent-2': '#E8733A',
        muted: '#6B7566',
        border: '#D8DDD4',
        surface: '#FFFFFF',
        'app-text': '#1C2218',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
