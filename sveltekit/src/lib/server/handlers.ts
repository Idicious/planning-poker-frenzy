import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import {
	error,
	invalid,
	type LoadEvent,
	type RequestEvent,
	type ServerLoadEvent
} from '@sveltejs/kit';
import type { z } from 'zod';

export function authenticate<R, T extends RequestEvent | ServerLoadEvent | LoadEvent>(
	handler: (event: T) => R | Promise<R>
): (event: T) => R | Promise<R> {
	return async (event: T) => {
		const { session } = await getSupabase(event);

		if (session == null) {
			throw error(403, 'Unauthorized');
		}

		return handler(event);
	};
}

export function validate<TSchema, TResult>(
	schema: z.ZodSchema<TSchema>,
	handler: (event: RequestEvent, data: TSchema) => TResult
) {
	return async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData.entries()) as TSchema;
		const parsedData = await schema.safeParseAsync(data);

		if (parsedData.success) {
			return handler(event, parsedData.data);
		}

		const errors = parsedData.error.flatten().fieldErrors;
		const payload = { ...data, errors } as const;

		return invalid(400, payload);
	};
}
