/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Clase nueva 'font-titulo' solo para títulos (Montserrat)
        titulo: ['Montserrat', 'sans-serif'], 
        // Clase para cuerpo y Lectura (Lato)
        body: ['Lato', 'sans-serif'],
      },
      colors: {
        // Paleta de colores personalizada
        surface: 'var(--color-surface)',
				primary: 'var(--color-text-main)',
				inverted: 'var(--color-text-inverted)',
				action: 'var(--color-action)',
				brand: 'var(--color-brand)',
        theme: 'var(--color-theme)',
        themeText: 'var(--color-theme-text)',
        muted: 'var(--color-text-muted)',
        button: 'var(--color-button)',
        secondTheme: 'var(--color-second-theme)',
        brandInverted: 'var(--color-brand-inverted)',
        invertedAction: 'var(--color-inverted-action)',
        themeInverted: 'var(--color-theme-inverted)',
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