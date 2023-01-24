import { validateFormData } from '$lib/forms/validation';
import { ProfileService } from '$lib/profile/profile.service';
import { ProfileDTOSchema } from '$lib/profile/schemas';
import { fail, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const profileService = locals.injector.get(ProfileService);
	const profile = await profileService.getProfile();

	return { profile };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { errors, result, formData } = await validateFormData(request, ProfileDTOSchema);

		if (errors) {
			const { avatar: _, ...rest } = formData;
			return fail(400, { errors, formData: rest });
		}

		const { avatar, ...profile } = result;

		const profileService = locals.injector.get(ProfileService);
		await profileService.updateProfile(profile, avatar);

		throw redirect(302, '/user/profile');
	}
};
