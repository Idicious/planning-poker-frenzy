import { RoomService } from '$lib/room/room.service';
import { CreateRoomDTOSchema, type CreateRoomDTO } from '$lib/room/schemas';
import { formatParseError, type FormData } from '$lib/schemas/format-parse-error';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const validationResult = CreateRoomDTOSchema.safeParse(formData);

		if (!validationResult.success) {
			return formatParseError(validationResult, formData);
		}

		const roomService = locals.injector.get(RoomService);
		const roomExists = await roomService.roomExists(validationResult.data.name);

		if (roomExists) {
			return fail(400, {
				success: false as const,
				errors: { name: ['Room already exists'] },
				data: formData as FormData<CreateRoomDTO>
			});
		}

		const result = await roomService.createRoom(validationResult.data);
		throw redirect(302, `/user/room/${result.name}`);
	}
};
