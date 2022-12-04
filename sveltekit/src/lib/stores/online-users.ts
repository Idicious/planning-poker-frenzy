import { supabaseClient } from '$lib/db';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { derived, get, writable, type Writable } from 'svelte/store';
import { userIconPositionStore } from './user-icon-positions';

export interface OnlineUser {
	vote: number;
	email: string;
	presence_ref: string;
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
	const revealStore = writable(false);
	const vote = writable<string | number | null>(null);

	let channel: RealtimeChannel | null = null;
	let joined: Date | null = null;

	async function joinRoom(room: string, email = 'anonymous') {
		if (channel) await leave();
		joined = new Date();

		channel = await createChannelForRoom(room, email, store, revealStore);
		channel.track({ vote: get(vote), joined });
	}

	async function leave() {
		if (channel) await channel.unsubscribe();

		channel = null;
		joined = null;

		store.set(initialState);
		vote.set(null);
		userIconPositionStore.resetAll();
	}

	return {
		subscribe: store.subscribe,
		votesRevealed: { subscribe: revealStore.subscribe },
		currentVote: { subscribe: vote.subscribe },
		joinRoom,
		leave,
		setVote(value: string | number | null) {
			vote.set(value);
			channel?.track({ vote: value, joined });
		},
		revealVotes(value: boolean) {
			channel?.send({ type: 'broadcast', event: 'reveal', payload: value });
		}
	};
}

function createChannelForRoom(
	room: string,
	email: string,
	store: Writable<RoomState>,
	revealStore: Writable<boolean>
) {
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

		channel.on('broadcast', { event: 'reveal' }, ({ payload }) => {
			if (payload === false) {
				userIconPositionStore.resetLast();
			}

			revealStore.set(payload);
		});

		channel.on('presence', { event: 'sync' }, () => {
			const presenceState = channel.presenceState();
			const firstJoinedUser = Object.entries(presenceState)
				.sort(([, [{ joined: joinedA }]], [, [{ joined: joinedB }]]) => {
					const aJoined = new Date(joinedA);
					const bJoined = new Date(joinedB);
					return aJoined.getTime() - bJoined.getTime();
				})
				.at(0);

			const host = firstJoinedUser?.[0] ?? null;
			const users = Object.entries(presenceState).map(([key, [state]]) => ({
				email: key,
				presence_ref: state.presence_ref,
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
