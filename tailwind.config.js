/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				purple: '#E76BF3',
				blue: '#00B0F6',
				green: '#00BF7D',
				pea: '#A3A500',
                red: '#F8766D'
			}
		}
	},
	plugins: []
};
