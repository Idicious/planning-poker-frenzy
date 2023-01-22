import { createClient, getSupabase as _getSupabase } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { redirect, type RequestEvent } from '@sveltejs/kit';

// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export async function getSupabase(event: RequestEvent) {
	const { supabaseClient, session } = await _getSupabase(event);

	if (session == null) {
		throw redirect(302, '/login');
	}

	return { supabaseClient, session };
}
