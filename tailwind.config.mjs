/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Clase nueva 'font-titulo' solo para títulos (Montserrat)
        titulo: ['Montserrat', 'sans-serif'], 
        // Clase para cuerpo y Lectura (Lato)
        body: ['Lato', 'sans-serif'],
      },
      colors: {
        // Paleta extraída de tu diseño original
        t3: {
          cream: '#fdfbf7',    // Fondo Navbar / Menú Móvil
          dark: '#1c1c2e',     // Texto Principal / Iconos Dark
          boton: '#183153',     // Botón Principal
          sage: '#A5BBA7',     // Acento / Hover del Botón
        }
      },
      // 1. Definimos los keyframes (los pasos de la animación)
			keyframes: {
				scaleUp: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.95)' },
				}
			},
			// 2. Creamos la utilidad de animación
			animation: {
				scaleUp: 'scaleUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
			}
    },
  },
  plugins: [],
}