import { SignInDTOSchema, SocialDTOSchema } from '$lib/auth/schemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const parseResult = SignInDTOSchema.safeParse(formData);

		if (!parseResult.success) {
			return fail(400, { authError: true });
		}

		const { error } = await locals.supabase.auth.signInWithPassword(parseResult.data);

		if (error != null) {
			return fail(400, { authError: true });
		}

		throw redirect(303, '/');
	},
	social: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const parseResult = SocialDTOSchema.safeParse(formData);

		if (!parseResult.success) {
			return fail(400, { authError: true });
		}

		const redirectTo = new URL(request.url).origin;

		const { error, data } = await locals.supabase.auth.signInWithOAuth({
			provider: parseResult.data.provider,
			options: {
				redirectTo
			}
		});

		if (error != null) {
			return fail(400, { authError: true });
		}

		throw redirect(303, data.url);
	},
	logout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/login');
	}
};
