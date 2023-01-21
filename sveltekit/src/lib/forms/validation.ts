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
