import { browser } from '$app/environment';
import { supabaseClient } from '$lib/db';
import type { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js';
import { derived, get, writable, type Writable } from 'svelte/store';
import { userIconPositionStore } from './user-icon-positions';

export interface OnlineUser {
	vote?: string;
	username: string;
	avatarUrl: string | null;
	joined: Date;
	presence_ref: string;
}

const createRealtimeConfig = (username: string) => ({
	config: {
		presence: {
			key: username
		},
		broadcast: {
			self: true
		}
	}
});

export function createOnlineUsersStore(room: string, username: string, avatarUrl: string | null) {
	const onlineUsersStore = writable<OnlineUser[]>([]);
	const voteStore = writable<string | null>(null);
	const avatarUrlStore = writable<string | null>(avatarUrl);
	const revealStore = writable(false);
	const joined = new Date();

	const allVoted = derived(onlineUsersStore, ($onlineUsers) =>
		$onlineUsers.every((user) => user.vote != null)
	);

	const hostStore = derived(onlineUsersStore, ($onlineUsers) => {
		const firstJoinedUser = getFirstJoinedUser($onlineUsers);
		return firstJoinedUser?.username;
	});

	const channel = supabaseClient.channel(`online-users-${room}`, createRealtimeConfig(username));
	configureChannel(channel, onlineUsersStore, revealStore, joined, avatarUrl);

	return {
		currentVote: { subscribe: voteStore.subscribe },
		onlineUsers: { subscribe: onlineUsersStore.subscribe },
		host: { subscribe: hostStore.subscribe },
		votesRevealed: { subscribe: revealStore.subscribe },
		allVoted: { subscribe: allVoted.subscribe },
		leave() {
			channel.unsubscribe();
		},
		setVote(vote: string | null) {
			const avatarUrl = get(avatarUrlStore);
			voteStore.set(vote);

			channel.track({ vote, joined, avatarUrl });
		},
		revealVotes(value: boolean) {
			channel.send({ type: 'broadcast', event: 'reveal', value });
		}
	};
}

function configureChannel(
	channel: RealtimeChannel,
	onlineUsersStore: Writable<OnlineUser[]>,
	revealStore: Writable<boolean>,
	joined: Date,
	avatarUrl: string | null
) {
	if (!browser) return;

	channel.on('broadcast', { event: 'reveal' }, ({ value }) => {
		if (value === false) {
			userIconPositionStore.resetLast();
		}

		revealStore.set(value);
	});

	channel.on('presence', { event: 'sync' }, () => {
		const presenceState = channel.presenceState();

		const users = presenceStateToUsers(presenceState);
		onlineUsersStore.set(users);
	});

	channel.subscribe((status, err) => {
		if (status === 'CHANNEL_ERROR') {
			console.error(err);
		}

		if (status === 'SUBSCRIBED') {
			console.log('Subscribed to online users channel');
			channel.track({ vote: null, joined, avatarUrl });
		}
	});
}

function presenceStateToUsers(presenceState: RealtimePresenceState) {
	return Object.entries(presenceState).map(([key, [state]]) => ({
		username: key,
		presence_ref: state.presence_ref ?? null,
		vote: state.vote ?? null,
		avatarUrl: state.avatarUrl ?? null,
		joined: new Date(state.joined)
	})) as OnlineUser[];
}

function getFirstJoinedUser(onlineUsers: OnlineUser[]) {
	return onlineUsers
		.sort(({ joined: joinedA }, { joined: joinedB }) => {
			const aJoined = joinedA;
			const bJoined = joinedB;
			return aJoined.getTime() - bJoined.getTime();
		})
		.at(0);
}
