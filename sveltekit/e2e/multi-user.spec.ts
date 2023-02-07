import { Page, test } from '@playwright/test';

test.describe('Multiple users', () => {
	let bobPage: Page;
	let alicePage: Page;

	test.beforeEach(async ({ browser }) => {
		const bobContext = await browser.newContext({ storageState: 'e2e/BobStorageState.json' });
		const aliceContext = await browser.newContext({ storageState: 'e2e/AliceStorageState.json' });

		bobPage = await bobContext.newPage();
		alicePage = await aliceContext.newPage();
	});

	test('Room should show two users', async () => {
		await bobPage.goto('/user/room');
		await alicePage.goto('/user/room');

		await bobPage.getByRole('link', { name: 'bob' }).click();
		await alicePage.getByRole('link', { name: 'bob' }).click();

		await bobPage.getByRole('figure', { name: 'alice' }).isVisible();
		await alicePage.getByRole('figure', { name: 'bob' }).isVisible();
	});
});
