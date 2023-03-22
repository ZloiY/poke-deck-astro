/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        coiny: ['var(--font-coiny)'],
        modak: ['var(--font-modak)'],
        fredoka: ['var(--font-fredoka)']
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite'
      }
    },
	},
	plugins: [require('tailwind-scrollbar')],
}
