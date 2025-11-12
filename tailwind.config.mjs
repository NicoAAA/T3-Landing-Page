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
    },
  },
  plugins: [],
}