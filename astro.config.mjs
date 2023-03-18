import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import svgr from "vite-plugin-svgr";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/edge";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind()],
  vite: {
    plugins: [svgr()]
  },
  adapter: vercel()
});
