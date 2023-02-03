import { type PlaywrightTestConfig, chromium } from '@playwright/test';

const testUsers = ['Bob', 'Alice'];

export default async (_config: PlaywrightTestConfig) => {
	const browser = await chromium.launch();

	for (const user of testUsers) {
		const context = await browser.newContext();
		const page = await context.newPage();

		await page.goto('http://localhost:5173/login');

		await page.getByLabel('email').fill(`${user}@localhost.dev`);
		await page.getByLabel('password').fill('password');

		await page.getByRole('button', { name: 'login' }).click();
		await page.waitForURL('http://localhost:5173');

		await context.storageState({ path: `e2e/${user}StorageState.json` });
	}

	await browser.close();
};
