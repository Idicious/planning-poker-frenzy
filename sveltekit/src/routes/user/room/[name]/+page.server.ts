import { ProfileService } from '$lib/profile/profile.service';
import { RoomService } from '$lib/room/room.service';
import { error as httpError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const roomService = locals.injector.get(RoomService);
	const profileService = locals.injector.get(ProfileService);

	const [profile, room] = await Promise.all([
		profileService.getProfile(),
		roomService.getRoom(params.name)
	]);

	if (room == null) {
		throw httpError(404, 'Room not found');
	}

	return {
		avatarUrl: profile.avatar_url,
		room
	};
};
