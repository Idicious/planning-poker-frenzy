import { Tokens } from '$lib/di-tokens';
import { mockServer } from '$lib/testing/mock-server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { Container } from 'inversify';
import { rest } from 'msw';
import { AvatarService } from './avatar.service';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
	let profileService: ProfileService;

	beforeEach(async () => {
		const container = new Container();
		const supabaseClient = createClient('http://mock', 'secret');

		container.bind(ProfileService).toSelf();
		container.bind(AvatarService).toSelf();
		container.bind(SupabaseClient).toConstantValue(supabaseClient);
		container.bind(Tokens.Session).toConstantValue({ user: { id: '1' } });

		profileService = container.get(ProfileService);
	});

	test('getProfile returns profile on success', async () => {
		mockServer.use(
			rest.get(/\/profiles/, (_, res, ctx) => {
				return res.once(ctx.status(200), ctx.json({ id: '1' }));
			})
		);

		const profile = await profileService.getProfile();
		expect(profile).toEqual({ id: '1' });
	});

	test('getProfile throws a generic error when supabase request fails', async () => {
		mockServer.use(
			rest.get(/\/profiles/, (_, res, ctx) => {
				return res.once(ctx.status(500, 'supabase error'));
			})
		);

		expect(() => profileService.getProfile()).rejects.toThrow(
			expect.objectContaining(error(500, 'Error fetching profile'))
		);
	});
});
