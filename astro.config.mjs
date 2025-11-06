import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // <-- El import CORRECTO

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()] // <-- La configuración CORRECTA
});