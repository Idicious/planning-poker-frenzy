import { supabaseClient } from '$lib/db';
import type { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js';
import { derived, get, writable, type Writable } from 'svelte/store';
import { userIconPositionStore } from './user-icon-positions';

export interface OnlineUser {
	vote: string | null;
	username: string;
	avatarUrl: string | null;
	joined: Date;
	presence_ref: string;
}

const createRealtimeConfig = (username: string) => ({
	presence: {
		key: username
	},
	broadcast: {
		self: true
	}
});

export function createOnlineUsersStore(room: string) {
	const onlineUsersStore = writable<OnlineUser[]>([]);
	const voteStore = writable<string | null>(null);
	const avatarUrlStore = writable<string | null>(null);
	const revealStore = writable(false);
	const joined = new Date();

	const allVoted = derived(onlineUsersStore, ($onlineUsers) =>
		$onlineUsers.every((user) => user.vote != null)
	);

	const hostStore = derived(onlineUsersStore, ($onlineUsers) => {
		const firstJoinedUser = getFirstJoinedUser($onlineUsers);
		return firstJoinedUser?.username;
	});

	const channel = supabaseClient.channel(`online-users-${room}`);
	configureChannel(channel, onlineUsersStore, revealStore);

	function join(username: string, avatarUrl: string | null) {
		avatarUrlStore.set(avatarUrl);
		channel.params.config = createRealtimeConfig(username);

		channel.subscribe((status, err) => {
			if (status === 'CHANNEL_ERROR') {
				console.error(err);
			}

			if (status === 'SUBSCRIBED') {
				channel.track({ vote: null, joined, avatarUrl });
			}
		});
	}

	return {
		currentVote: { subscribe: voteStore.subscribe },
		onlineUsers: { subscribe: onlineUsersStore.subscribe },
		host: { subscribe: hostStore.subscribe },
		votesRevealed: { subscribe: revealStore.subscribe },
		allVoted: { subscribe: allVoted.subscribe },
		join,
		leave() {
			channel.unsubscribe();
		},
		setVote(value: string | null) {
			const avatarUrl = get(avatarUrlStore);
			voteStore.set(value);

			channel.track({ vote: value, joined, avatarUrl });
		},
		revealVotes(value: boolean) {
			channel.send({ type: 'broadcast', event: 'reveal', payload: value });
		}
	};
}

function configureChannel(
	channel: RealtimeChannel,
	onlineUsersStore: Writable<OnlineUser[]>,
	revealStore: Writable<boolean>
) {
	channel.on('broadcast', { event: 'reveal' }, ({ payload }) => {
		if (payload === false) {
			userIconPositionStore.resetLast();
		}

		revealStore.set(payload);
	});

	channel.on('presence', { event: 'sync' }, () => {
		const presenceState = channel.presenceState();

		const users = presenceStateToUsers(presenceState);
		onlineUsersStore.set(users);
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
