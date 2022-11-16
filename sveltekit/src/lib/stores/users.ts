import { supabaseClient } from '$lib/db';
import { page } from '$app/stores';
import { browser } from '$app/environment';
import { voteStore } from './vote';
import { derived, readable, writable, type Readable, type Unsubscriber } from 'svelte/store';

type Presence = { email: string; vote?: number | null };

export function createOnlineUsersStore(roomId?: string, email?: string) {
	if (!browser || roomId == null || email == null) return readable<Presence[]>([]);

	const channel = supabaseClient.channel(`online-users-${roomId}`, {
		config: {
			presence: {
				key: email
			},
			broadcast: {
				self: true
			}
		}
	});

	let unsubscribe: Unsubscriber;
	const { subscribe, set } = writable<Presence[]>([], () => {
		return () => {
			console.info(`Unsubscribing from online users for room ${roomId}`);
			if (unsubscribe) unsubscribe();
			return channel.unsubscribe();
		};
	});

	channel.on('presence', { event: 'sync' }, () => {
		const presenceState = channel.presenceState();
		console.info('Online users: ', presenceState);

		const userList = Object.entries(presenceState).map(
			([email, [state]]) => ({ ...state, email } as Presence)
		);

		set(userList);
	});

	console.info(`Subscribing to online users for room ${roomId}`);
	channel.subscribe(async (status, err) => {
		if (status === 'CHANNEL_ERROR') {
			console.error('error subscribing to channel', err);
		}

		if (status === 'SUBSCRIBED') {
			unsubscribe = voteStore.subscribe(async (vote) => {
				const status = await channel.track({ vote });
				console.info('tracking with status', status);
			});
		}
	});

	return {
		subscribe
	};
}

export function createIsHostStore(users: Readable<Presence[]>) {
	return derived([users, page], ([$users, $page]) => {
		if ($page.data.session == null) return false;

		return $users.at(0)?.email === $page.data.session.user.email;
	});
}
