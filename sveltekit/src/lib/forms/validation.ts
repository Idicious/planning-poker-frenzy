import type { z } from 'zod';

export function removeEmptyFile(file: Blob) {
	if (file.size > 0) return file;
	return undefined;
}

/**
 * Typescript helper to discriminate union types created with formatParseError
 *
 * @example
 * ```ts
 * type LoginActionData = TaggedActionData<'login', ActionData>
 * ```
 */
export type TaggedActionData<TTag extends string, TData> = TData & { tag: TTag };

export function withTag<TData, TTag extends string>(
	data: TData | null,
	_tag: TTag
): TaggedActionData<TTag, TData> {
	return data as TaggedActionData<TTag, TData>;
}

export type FormData<TSchema = unknown> = {
	[K in keyof TSchema]: TSchema[K] extends Blob ? Blob : string;
};

type ValidResult<TSchema> = { result: TSchema; errors: null; formData: FormData<TSchema> };
type InvalidResult<TSchema> = {
	result: null;
	errors: z.inferFlattenedErrors<z.ZodType<TSchema>>['fieldErrors'];
	formData: FormData<TSchema>;
};

export async function validateFormData<TSchema>(
	request: Request,
	schema: z.ZodType<TSchema>
): Promise<ValidResult<TSchema> | InvalidResult<TSchema>> {
	const data = Object.fromEntries(await request.formData());
	const parseResult = schema.safeParse(data);

	if (parseResult.success) {
		return { result: parseResult.data, errors: null, formData: data as FormData<TSchema> };
	}

	return {
		result: null,
		errors: parseResult.error.flatten().fieldErrors,
		formData: data as FormData<TSchema>
	};
}
