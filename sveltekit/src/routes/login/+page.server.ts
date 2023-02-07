import { AuthService } from '$lib/auth/auth.service';
import { SignInDTOSchema, SocialDTOSchema } from '$lib/auth/schemas';
import { validateFormData } from '$lib/forms/validation';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const { errors, result, formData } = await validateFormData(request, SignInDTOSchema);

		if (errors) {
			return fail(400, { errors, formData, tag: 'login' } as const);
		}

		const authService = locals.injector.get(AuthService);
		const { error } = await authService.signInWithPassword(result);

		if (error != null) {
			return fail(400, { authError: true, tag: 'login' } as const);
		}

		throw redirect(303, '/');
	},
	social: async ({ request, locals }) => {
		const { errors, result, formData } = await validateFormData(request, SocialDTOSchema);

		if (errors) {
			return fail(400, { errors, formData, tag: 'social' } as const);
		}

		const redirectTo = new URL(request.url).origin;
		const authService = locals.injector.get(AuthService);

		const { error, data: signInData } = await authService.signInWithOAuth(result, {
			redirectTo
		});

		if (error != null) {
			return fail(400, { authError: true } as const);
		}

		throw redirect(303, signInData.url);
	},
	logout: async ({ locals }) => {
		const authService = locals.injector.get(AuthService);
		await authService.signOut();

		throw redirect(303, '/login');
	}
};
