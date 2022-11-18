import { ProfileDTOSchema, type ProfileDTO } from '$lib/schemas/profile';
import { type Actions, invalid } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const dataObject = Object.fromEntries(data.entries()) as ProfileDTO;

		const parsed = ProfileDTOSchema.safeParse(dataObject);

		if (!parsed.success) {
			const res = { success: false, data: dataObject, errors: parsed.error.flatten() } as const;
			return invalid(400, res);
		}

		return { success: true, data: dataObject } as const;
	}
};
