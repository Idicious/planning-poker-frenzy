import { authenticate } from '$lib/server/handlers';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { type RequestHandler, error } from '@sveltejs/kit';

export const GET: RequestHandler = authenticate(async (event, session) => {
	const { supabaseClient } = await getSupabase(event);

	const { data, error: err } = await supabaseClient.storage
		.from('avatars')
		.download(`${session?.user.id}/avatar`);

	if (err != null) {
		console.error(err);
		throw error(500);
	}

	return new Response(data);
});
