import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import { execSync } from 'child_process';
import { devtools } from '@tanstack/devtools-vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [
    devtools(),
    react(),
    svgrPlugin(),
    nodePolyfills({ exclude: ['net'] })
  ],
	server: {
		open: true,
		host: '0.0.0.0',
  },
  resolve: {
    tsconfigPaths: true,
  },
  legacy: {
    inconsistentCjsInterop: true
  },
  build: {
    minify: false
  }
});
