import { getSupabase } from '$lib/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { session } = await getSupabase(event);

	return {
		session
	};
};
