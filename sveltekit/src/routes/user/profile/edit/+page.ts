import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const load: Load = async (event) => {
	const { supabaseClient, session } = await getSupabase(event);

	if (!session) {
		throw redirect(302, '/login');
	}

	const { error: err, data } = await supabaseClient
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (err) {
		throw error(500, err.message);
	}

	return data;
};
