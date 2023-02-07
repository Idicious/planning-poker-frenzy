import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/// <reference path="vitest" />

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID)
	},
	preview: {
		port: 5173,
		strictPort: true
	},
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['src/test-setup.ts'],
		dir: 'src'
	}
});
