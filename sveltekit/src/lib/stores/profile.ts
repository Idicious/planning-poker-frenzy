import { get, writable } from 'svelte/store';
import { page } from '$app/stores';
import { supabaseClient } from '$lib/db';
import type { PostgrestError } from '@supabase/supabase-js';

async function getProfile(userId: string) {
	return supabaseClient.from('profiles').select('*').eq('id', userId).single();
}

type ProfileResponse = Awaited<ReturnType<typeof getProfile>>;
type ProfileResponseSuccess = ProfileResponse['data'];
type DBReturnValue<T> = { data: T | null; error: PostgrestError | null; loading: boolean };

const defaultValue: DBReturnValue<ProfileResponseSuccess> = {
	data: null,
	error: null,
	loading: false
};

function createProfileStore() {
	const { set, subscribe } = writable(defaultValue);

	page.subscribe(($page) => {
		if ($page.data?.session == null) return set({ data: null, error: null, loading: false });

		set({ data: null, error: null, loading: true });
		getProfile($page.data.session.user.id).then(({ error, data }) => {
			set({ data, error, loading: false });
		});
	});

	function updateProfile(value: Partial<Omit<ProfileResponseSuccess, 'id'>> & { id: string }) {
		supabaseClient
			.from('profiles')
			.update(value)
			.eq('id', value.id)
			.then(({ error }) => {
				const current = get({ subscribe });
				const updated = { ...current.data, ...value } as ProfileResponseSuccess;
				set({ data: updated, error, loading: false });
			});
	}

	return {
		subscribe,
		updateProfile
	};
}

export const profile = createProfileStore();
