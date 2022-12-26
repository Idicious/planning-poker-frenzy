import { fail } from '@sveltejs/kit';
import type { z } from 'zod';

export function formatParseError<TSchema, TData>(
	parseResult: z.SafeParseError<TSchema>,
	data: TData
) {
	const errors = parseResult.error.flatten().fieldErrors;
	return fail(400, { success: false, errors, ...data } as const);
}
