/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#00B0F6',
				secondary: '#e2e2d5',
				input: '#888883',
				border: ' #e2e2d5'
			}
		}
	},
	plugins: []
};
