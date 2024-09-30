/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

export const content = ['./src/**/*.{js,jsx,ts,tsx}', './index.html'];

export const theme = {
	extend: {
		fontFamily: {
			sans: ['Fredoka', ...fontFamily.sans],
			mono: ['Consolas', ...fontFamily.mono],
			logo: 'Righteous',
		},
	},
};

// font-family: Menlo, Consolas, Monaco, Liberation Mono, Lucida Console,
//   monospace;
