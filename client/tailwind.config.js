/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Bleu profond
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#F97316', // Orange vif
          light: '#FB923C',
          dark: '#EA580C',
        },
        accent: {
          DEFAULT: '#10B981', // Vert menthe
          light: '#34D399',
          dark: '#059669',
        },
        neutral: {
          DEFAULT: '#64748B', // Gris ardoise
          light: '#94A3B8',
          dark: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}