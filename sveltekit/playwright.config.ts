import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 5173
	},
	testDir: 'e2e',
	globalSetup: 'e2e/setup.ts',
	use: {
		storageState: 'e2e/storageState.json'
	}
};

export default config;
