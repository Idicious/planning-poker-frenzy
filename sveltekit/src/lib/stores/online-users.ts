import { supabaseClient } from '$lib/db';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { derived, get, writable, type Writable } from 'svelte/store';
import { voteStore } from './vote';

interface OnlineUser {
	vote: number;
	email: string;
}

interface RoomState {
	host: string | null;
	users: OnlineUser[];
}

const initialState: RoomState = {
	host: null,
	users: []
};

export const onlineUsers = createOnlineUsersStore();
export const allVoted = derived(onlineUsers, ($onlineUsers) =>
	$onlineUsers.users.every((user) => user.vote != null)
);

function createOnlineUsersStore() {
	const store = writable<RoomState>(initialState);

	let channel: RealtimeChannel | null = null;
	voteStore.subscribe((value) => channel?.track({ vote: value }));

	async function joinRoom(room: string, email = 'anonymous') {
		if (channel) await leave();

		console.info(`Subscribing to online users for room ${room}`);
		channel = await createChannelForRoom(room, email, store);

		channel.track({ vote: get(voteStore) });
	}

	async function leave() {
		console.info(`Leaving current room`);
		if (channel) await channel.unsubscribe();

		channel = null;

		store.set(initialState);
		voteStore.set(null);
	}

	return {
		subscribe: store.subscribe,
		joinRoom,
		leave
	};
}

function createChannelForRoom(room: string, email: string, store: Writable<RoomState>) {
	return new Promise<RealtimeChannel>((resolve, reject) => {
		const channel = supabaseClient.channel(`online-users-${room}`, {
			config: {
				presence: {
					key: email
				},
				broadcast: {
					self: true
				}
			}
		});

		channel.on('presence', { event: 'sync' }, () => {
			const presenceState = channel.presenceState();

			const host = Object.keys(presenceState).at(0) ?? null;
			const users = Object.entries(presenceState).map(([key, [state]]) => ({
				email: key,
				vote: state.vote
			})) as OnlineUser[];

			store.set({ host, users });
		});

		channel.subscribe((status, err) => {
			if (status === 'CHANNEL_ERROR') {
				reject(err);
			}

			if (status === 'SUBSCRIBED') {
				resolve(channel);
			}
		});

		return channel;
	});
}
