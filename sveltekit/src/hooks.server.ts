import '$lib/db';
import 'reflect-metadata';

import { appContainer } from '$lib/inversify.config';
import { Tokens } from '$lib/di-tokens';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { Container } from 'inversify';

export const handle: Handle = async ({ event, resolve }) => {
	const { session, supabaseClient } = await getSupabase(event);

	if (session == null && event.url.pathname.startsWith('/user')) {
		throw redirect(303, '/login');
	}

	const container = new Container();

	container.bind(Tokens.Session).toConstantValue(session);
	container.bind(Tokens.Supabase).toConstantValue(supabaseClient);

	container.load(appContainer);
	event.locals.injector = container;

	return resolve(event);
};
