import { RoomService } from '$lib/room/room.service';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const roomService = locals.injector.get(RoomService);
	const roomName = url.searchParams.get('name');

	if (roomName == null) throw error(400, 'Missing room name');

	const roomExists = await roomService.roomExists(roomName);
	return json(!roomExists);
};
