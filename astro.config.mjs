import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // <-- El import CORRECTO

import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(), 
    sanity({
      projectId: "9fioqt11",
      dataset: "production",
      useCdn: true,
    })
  ] 
});