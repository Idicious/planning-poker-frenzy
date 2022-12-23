import { ProfileService } from '$lib/profile/profile.service';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const profileService = locals.injector.get(ProfileService);
	return profileService.getProfile();
};
