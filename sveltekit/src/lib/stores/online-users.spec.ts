import { supabaseClient } from '$lib/db';
import { basicMocked } from '$lib/testing/utils';
import { RealtimeChannel } from '@supabase/supabase-js';
import { get } from 'svelte/store';
import { createOnlineUsersStore } from './online-users';

vi.mock('$lib/db');
vi.mock('@supabase/supabase-js');
vi.mock('$app/environment', () => ({
	browser: true
}));

describe('createOnlineUsersStore', async () => {
	const mockSupabaseClient = vi.mocked(supabaseClient);
	const mockChannel = basicMocked(RealtimeChannel.prototype);

	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime('2022-01-01');

		vi.stubEnv('PUBLIC_SUPABASE_URL', 'url');
		vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'key');
	});

	afterAll(() => {
		vi.useRealTimers();
		vi.unstubAllEnvs();
	});

	beforeEach(() => {
		mockSupabaseClient.channel.mockReturnValue(mockChannel as any);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test('should initialize', () => {
		const store = createOnlineUsersStore('room', 'username', 'avatarUrl');
		expect(store).toBeTruthy();

		expect(mockSupabaseClient.channel).toHaveBeenCalledWith('online-users-room', expect.anything());
	});

	test('should subscribe to channel', () => {
		createOnlineUsersStore('room', 'username', 'avatarUrl');
		expect(mockChannel.subscribe).toHaveBeenCalled();
	});

	test('values should be tracked after a successful subscription', () => {
		mockChannel.subscribe.mockImplementation((cb) => cb('SUBSCRIBED', null));
		createOnlineUsersStore('room', 'username', 'avatarUrl');

		expect(mockChannel.track).toHaveBeenCalledWith({
			vote: null,
			joined: new Date('2022-01-01'),
			avatarUrl: 'avatarUrl'
		});
	});

	test('host should be the first user that joined', () => {
		mockChannel.on.mockImplementation((event, _, cb) => event === 'presence' && cb());
		mockChannel.presenceState.mockReturnValue({
			user1: [{ joined: '2021-01-02', presence_ref: 'ref1' }],
			user2: [{ joined: '2021-01-01', presence_ref: 'ref2' }]
		});
		const store = createOnlineUsersStore('room', 'username', 'avatarUrl');

		const host = get(store.host);
		expect(host).toBe('user2');
	});

	test('online users should be updated when a user joins', () => {
		mockChannel.on.mockImplementation((event, _, cb) => event === 'presence' && cb());
		mockChannel.presenceState.mockReturnValue({
			user1: [{ joined: '2021-01-01', presence_ref: 'ref1' }],
			user2: [{ joined: '2021-01-02', presence_ref: 'ref2' }]
		});
		const store = createOnlineUsersStore('room', 'username', 'avatarUrl');

		const onlineUsers = get(store.onlineUsers);
		expect(onlineUsers).toEqual([
			expect.objectContaining({
				username: 'user1',
				joined: new Date('2021-01-01')
			}),
			expect.objectContaining({
				username: 'user2',
				joined: new Date('2021-01-02')
			})
		]);
	});

	test('when a user votes, the vote is broadcast to all clients', () => {
		const store = createOnlineUsersStore('room', 'username', 'avatarUrl');
		store.setVote('3');

		expect(mockChannel.track).toHaveBeenCalledWith(expect.objectContaining({ vote: '3' }));
	});

	test('when the host reveals votes, reveal is broadcast to all clients', () => {
		const store = createOnlineUsersStore('room', 'username', 'avatarUrl');
		store.revealVotes(true);

		expect(mockChannel.send).toHaveBeenCalledWith(
			expect.objectContaining({
				value: true
			})
		);
	});

	test('when vote revealed broadcast is received the store is updated', () => {
		mockChannel.on.mockImplementation(
			(event, _, cb) => event === 'broadcast' && cb({ value: true })
		);
		const store = createOnlineUsersStore('room', 'username', 'avatarUrl');

		const revealed = get(store.votesRevealed);
		expect(revealed).toBe(true);
	});

	test('when a user leaves the channel they should be unsubscribed from channel', () => {
		const store = createOnlineUsersStore('room', 'username', 'avatarUrl');
		store.leave();

		expect(mockChannel.unsubscribe).toHaveBeenCalled();
	});

	test('when all users have voted, allVoted store should return true', () => {
		mockChannel.on.mockImplementation((event, _, cb) => event === 'presence' && cb());
		mockChannel.presenceState.mockReturnValue({
			user1: [{ joined: '2021-01-01', vote: '1', presence_ref: 'ref1' }],
			user2: [{ joined: '2021-01-02', vote: '2', presence_ref: 'ref2' }]
		});

		const store = createOnlineUsersStore('room', 'username', 'avatarUrl');

		const allVoted = get(store.allVoted);
		expect(allVoted).toBe(true);
	});
});
