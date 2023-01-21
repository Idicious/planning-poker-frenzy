import { AuthService } from '$lib/auth/auth.service';
import {
	SignInDTOSchema,
	SocialDTOSchema,
	type SignInDTO,
	type SocialDTO
} from '$lib/auth/schemas';
import { formatParseError } from '$lib/schemas/format-parse-error';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const parseResult = SignInDTOSchema.safeParse(formData);

		if (!parseResult.success) {
			return formatParseError(parseResult, formData as SignInDTO, 'login');
		}

		const authService = locals.injector.get(AuthService);
		const { error } = await authService.signInWithPassword(parseResult.data);

		if (error != null) {
			return fail(400, { authError: true } as const);
		}

		throw redirect(303, '/');
	},
	social: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const parseResult = SocialDTOSchema.safeParse(formData);

		if (!parseResult.success) {
			return formatParseError(parseResult, formData as SocialDTO, 'social');
		}

		const redirectTo = new URL(request.url).origin;
		const authService = locals.injector.get(AuthService);

		const { error, data } = await authService.signInWithOAuth(parseResult.data, {
			redirectTo
		});

		if (error != null) {
			return fail(400, { authError: true } as const);
		}

		throw redirect(303, data.url);
	},
	logout: async ({ locals }) => {
		const authService = locals.injector.get(AuthService);
		await authService.signOut();

		throw redirect(303, '/login');
	}
};
