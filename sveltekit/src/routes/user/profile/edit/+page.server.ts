import { ProfileService } from '$lib/profile/profile.service';
import { formatParseError } from '$lib/schemas/format-parse-error';
import { ProfileDTOSchema } from '$lib/profile/schemas';
import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { omit } from 'lodash-es';

export const load: ServerLoad = async ({ locals }) => {
	const profileService = locals.injector.get(ProfileService);
	return profileService.getProfile();
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const validationResult = ProfileDTOSchema.safeParse(formData);

		if (!validationResult.success) {
			return formatParseError(validationResult, omit(formData, ['avatar']));
		}

		const { avatar, ...profile } = validationResult.data;

		const profileService = locals.injector.get(ProfileService);
		await profileService.updateProfile(profile, avatar);

		throw redirect(302, '/user/profile');
	}
};
