import { execSync } from 'node:child_process';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		__COMMIT_HASH__: JSON.stringify(commitHash),
	},
	plugins: [devtools(), tailwindcss(), react(), svgrPlugin()],
	server: {
		open: true,
		host: '0.0.0.0',
	},
	resolve: {
		tsconfigPaths: true,
	},
	legacy: {
		inconsistentCjsInterop: true,
	},
	build: {
		minify: false,
	},
});
