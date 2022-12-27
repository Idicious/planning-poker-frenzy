import { type PlaywrightTestConfig, chromium } from '@playwright/test';

export default async (_config: PlaywrightTestConfig) => {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto('http://localhost:5173/login');

	await page.getByLabel('username').fill('user@localhost');
	await page.getByLabel('password').fill('password');

	await page.getByRole('button', { name: 'login' }).click();
	await page.waitForURL('http://localhost:5173');

	await page.context().storageState({ path: 'e2e/storageState.json' });
	await browser.close();
};
