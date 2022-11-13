import { supabaseClient } from '$lib/db';
import { page } from '$app/stores';
import { browser } from '$app/environment';
import { derived, readable, writable, type Readable } from 'svelte/store';

type Presence = { presence_ref: string };

export function createOnlineUsersStore(roomId?: string, email?: string) {
	if (!browser || roomId == null || email == null) return readable<Presence[]>([]);

	const channel = supabaseClient.channel(`online-users-${roomId}`, {
		config: {
			presence: {
				key: email
			}
		}
	});

	const { subscribe, update } = writable<Presence[]>([], () => {
		return () => {
			console.log(`Unsubscribing from online users for room ${roomId}`);
			return channel.unsubscribe();
		};
	});

	channel.on('presence', { event: 'sync' }, () => {
		console.log('Online users: ', channel.presenceState());
	});

	channel.on('presence', { event: 'join' }, ({ newPresences }) => {
		console.log('New users have joined: ', newPresences);
		update((users) => [...users, ...newPresences]);
	});

	channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
		console.log('Users have left: ', leftPresences);
		update((users) =>
			users.filter((user) => !leftPresences.some((left) => left.presence_ref === user.presence_ref))
		);
	});

	console.log(`Subscribing to online users for room ${roomId}`);
	channel.subscribe(async (status, err) => {
		if (status === 'CHANNEL_ERROR') {
			console.log(err);
		}
	});

	return {
		subscribe
	};
}

export function createIsHostStore(users: Readable<Presence[]>) {
	return derived([users, page], ([$users, $page]) => {
		if ($page.data.session == null) return false;

		return $users.at(0) === $page.data.session.user.email;
	});
}
