import { Tokens } from '$lib/di-tokens';
import { mockServer } from '$lib/testing/mock-server';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { Container } from 'inversify';
import { rest } from 'msw';
import { ImageService } from './image.service';
import { ProfileService } from './profile.service';

vi.mock('imagekit');

describe('ProfileService', () => {
	let profileService: ProfileService;

	beforeEach(async () => {
		const container = new Container();
		const supabaseClient = createClient('http://mock', 'secret');

		container.bind(ProfileService).toSelf();
		container.bind(ImageService).toSelf();
		container.bind(Tokens.Supabase).toConstantValue(supabaseClient);
		container.bind(Tokens.Session).toConstantValue({ user: { id: '1' } });
		container.bind(Tokens.ImageKitConfig).toConstantValue({});

		profileService = container.get(ProfileService);
	});

	test('getProfile returns profile on success', async () => {
		mockServer.use(
			rest.get(/\/profiles/, (_, res, ctx) => {
				return res.once(ctx.json({ id: '1' }));
			})
		);

		const profile = await profileService.getProfile();
		expect(profile).toEqual({ id: '1' });
	});

	test('getProfile throws a generic error when supabase request fails', async () => {
		mockServer.use(
			rest.get(/\/profiles/, (_, res, ctx) => {
				return res.once(ctx.status(500), ctx.json({ message: 'supabase error' }));
			})
		);

		await expect(() => profileService.getProfile()).rejects.toThrow(
			expect.objectContaining(error(500, 'Error fetching profile'))
		);
	});
});
