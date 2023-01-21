export type BasicMock<T> = { [K in keyof T]: ReturnType<typeof vi.fn> };

/**
 * Typescript helper similar to vi.mocked, but with non strict types. Purely a type helper, does not change the runtime behavior.
 * @param obj
 * @returns
 */
export function basicMocked<T>(obj: T): BasicMock<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return obj as any;
}
