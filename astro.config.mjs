import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import svgr from "vite-plugin-svgr";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import nodePolyfills from "rollup-plugin-node-polyfills";
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import path from 'path';
import preserveDirectives from 'rollup-plugin-preserve-directives';
// https://astro.build/config

const projectRootDir = path.resolve('./');

export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind()],
  vite: {
    build: {
      rollupOptions: {
        external: [
          'react',
          'react/jsx-runtime',
          'react-dom',
          'react-dom/client',
        ],
        output: {
         // preserveModules: true,
        },
      },
    },
    plugins: [
        svgr({
          svgrOptions: {
            jsxRuntime: 'classic',
            ext: 'jsx'
          },
          icon: true,
        }),
        commonjs(),
        nodePolyfills(),
        nodeResolve({
          preferBuiltins: false,
        }),
        alias({
          entries: [
            { find: '@icons', replacement: path.resolve(projectRootDir, 'src/icons') },
          ],
        }),
        //preserveDirectives(),
        replace({
          React: '* as React',
          preventAssignment: true,
          include: [
            '**/react-hook-form/**/*.*js',
          ]
        }),
        replace({
          'useSyncExternalStore as useSyncExternalStore': 'default as useSyncExternalStore$1',
          preventAssignment: true,
          include: [
            '**/@tanstack+react-query*/**/useSyncExternalStore.*js'
          ]
        }),
        replace({
          'import { File, FormData, Headers, Request, Response, fetch }': 'import Undici',
          delimiters: ['', ''],
          preventAssignment: true,
          include: [
            '**/@astrojs*/**/*.*js'
          ]
        }),
    ]
  },
  adapter: vercel()
});
