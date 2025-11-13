/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Creamos una clase nueva 'font-brand' solo para items en el navbar
        brand: ['Montserrat', 'sans-serif'], 
      },
      colors: {
        // Tus colores personalizados
        brand: {
          DEFAULT: '#a5bba7', // Tu color base (bg-brand)
          light: '#c5d6c7',   // Para fondos muy suaves
          dark: '#4a5e4d',    // Para textos sobre fondos claros o bordes
        },
        // Colores semánticos para el modo oscuro/claro
        surface: {
          light: '#ffffff',
          dark: '#1f2937', // Gray-800
        },
        canvas: {
          light: '#f9fafb', // Gray-50
          dark: '#111827',  // Gray-900
        }
      },
    },
  },
  plugins: [],
}