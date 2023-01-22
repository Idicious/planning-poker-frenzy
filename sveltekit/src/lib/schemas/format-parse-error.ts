import { fail } from '@sveltejs/kit';
import type { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TaggedActionData } from '$lib/forms/validation';

type RetType<T extends Record<string, unknown> | undefined> = ReturnType<typeof fail<T>>;

export type FormData<TSchema = unknown> = {
	[K in keyof TSchema]: TSchema[K] extends Blob ? Blob : string;
};

/**
 * If multiple tagged actions are used, use the {@link TaggedActionData} type to discriminate the union type
 *
 * @param parseResult
 * @param data
 */
export function formatParseError<TSchema>(
	parseResult: z.SafeParseError<TSchema>,
	data: FormData
): RetType<{
	tag: 'validation-error';
	success: false;
	errors: z.inferFlattenedErrors<z.ZodType<TSchema>>['fieldErrors'];
	data: FormData<TSchema>;
}>;
export function formatParseError<TSchema, TTag extends string>(
	parseResult: z.SafeParseError<TSchema>,
	data: FormData,
	tag: TTag
): RetType<{
	tag: TTag;
	success: false;
	errors: z.inferFlattenedErrors<z.ZodType<TSchema>>['fieldErrors'];
	data: FormData<TSchema>;
}>;
export function formatParseError(
	parseResult: z.SafeParseError<unknown>,
	data: FormData,
	tag?: string
) {
	const errors = parseResult.error.flatten().fieldErrors;
	return fail(400, { tag: tag ?? 'validation-error', success: false, errors, data } as const);
}
