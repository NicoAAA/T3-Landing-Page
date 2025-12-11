import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind"; // <-- El import CORRECTO

import sanity from "@sanity/astro";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: 'server', 
  adapter: vercel(),
  integrations: [
    tailwind(), 
    sanity({
      projectId: "9fioqt11",
      dataset: "production",
      useCdn: false,
    })
  ],

  vite: {
    server:{
      allowedHosts: ['551133dcf324.ngrok-free.app'],
    },
  },
  
});