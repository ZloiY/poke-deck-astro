import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import svgr from "vite-plugin-svgr";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import alias from '@rollup/plugin-alias';
import path from 'path';
//import preserveDirectives from 'rollup-plugin-preserve-directives';
// https://astro.build/config

const projectRootDir = path.resolve('./');

export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind()],
  vite: {
    ssr: {
      external: ['react-select']
    },
    plugins: [
        svgr({
          svgrOptions: {
            jsxRuntime: 'classic',
            ext: 'jsx'
          },
          icon: true,
        }),
        alias({
          entries: [
            { find: '@icons', replacement: path.resolve(projectRootDir, 'src/icons') },
          ],
        }),
        // preserveDirectives(),
    ]
  },
  adapter: vercel()
});
