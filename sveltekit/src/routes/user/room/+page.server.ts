import { RoomService } from '$lib/room/room.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const roomService = locals.injector.get(RoomService);
	const rooms = await roomService.getRooms();

	return { rooms };
};
