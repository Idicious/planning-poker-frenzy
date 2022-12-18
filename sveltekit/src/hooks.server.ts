import '$lib/db';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { session, supabaseClient } = await getSupabase(event);

	event.locals.session = session;
	event.locals.sb = supabaseClient;

	if (session == null && event.url.pathname.startsWith('/user')) {
		throw redirect(303, '/login');
	}

	return resolve(event);
};
