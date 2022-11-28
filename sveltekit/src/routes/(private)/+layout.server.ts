import type { LayoutServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const { session } = await getSupabase(event);

	if (session == null) {
		throw redirect(303, '/login');
	}
};
