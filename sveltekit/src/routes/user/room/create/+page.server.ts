import { validateFormData } from '$lib/forms/validation';
import { RoomService } from '$lib/room/room.service';
import { CreateRoomDTOSchema } from '$lib/room/schemas';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { errors, result, formData } = await validateFormData(request, CreateRoomDTOSchema);

		if (errors) {
			return fail(400, { errors, formData });
		}

		const roomService = locals.injector.get(RoomService);
		const roomExists = await roomService.roomExists(result.name);

		if (roomExists) {
			return fail(400, {
				errors: { name: ['Room already exists'] },
				formData
			});
		}

		const room = await roomService.createRoom(result);
		throw redirect(302, `/user/room/${room.name}`);
	}
};
