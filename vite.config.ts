import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { execSync } from 'child_process';
import { devtools } from '@tanstack/devtools-vite';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
	plugins: [devtools(), react(), viteTsconfigPaths(), svgrPlugin()],
	server: {
		open: true,
		host: '0.0.0.0',
	},
});
