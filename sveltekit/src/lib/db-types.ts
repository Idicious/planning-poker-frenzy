import type { Database } from './generated-db-types';

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type EnsureArray<T extends object, K extends keyof T> = Omit<T, K> & {
	[P in K]: T[P] extends Array<infer U> | infer U | null ? Array<NonNullable<U>> : never;
};

export function ensureArray<T extends object, K extends keyof T>(
	obj: T,
	keys: K[],
	check = true
): EnsureArray<T, K> {
	if (check) {
		for (const key of keys) {
			if (!Array.isArray(obj[key])) {
				throw new Error(`Expected ${String(key)} to be an array`);
			}
		}
	}

	return obj as EnsureArray<T, K>;
}
