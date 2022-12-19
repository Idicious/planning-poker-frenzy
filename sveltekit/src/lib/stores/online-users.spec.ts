const mockCreateChannel = vi.fn();
import { get } from 'svelte/store';
import { createOnlineUsersStore } from './online-users';

vi.mock('@supabase/auth-helpers-sveltekit', () => ({
	createClient: () => ({
		channel: mockCreateChannel
	})
}));

const mockChannel = {
	on: vi.fn(),
	track: vi.fn(),
	presenceState: vi.fn(),
	send: vi.fn(),
	subscribe: vi.fn(),
	unsubscribe: vi.fn(),
	params: {}
};

describe('createOnlineUsersStore', () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime('2022-01-01');
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	beforeEach(() => {
		mockCreateChannel.mockReturnValue(mockChannel);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test('should initialize', () => {
		const store = createOnlineUsersStore('room');
		expect(store).toBeTruthy();

		expect(mockCreateChannel).toHaveBeenLastCalledWith('online-users-room');
	});

	test('should subscribe to channel', () => {
		const store = createOnlineUsersStore('room');
		store.join('username', null);

		expect(mockChannel.subscribe).toHaveBeenCalled();
	});

	test('values should be tracked after a successful subscription', () => {
		mockChannel.subscribe.mockImplementation((cb) => cb('SUBSCRIBED', null));

		const store = createOnlineUsersStore('room');
		store.join('username', 'avatarUrl');

		expect(mockChannel.track).toHaveBeenCalledWith({
			vote: null,
			joined: new Date('2022-01-01'),
			avatarUrl: 'avatarUrl'
		});
	});

	test('host should be the first user that joined', () => {
		mockChannel.on.mockImplementation((event, _, cb) => event === 'presence' && cb());
		mockChannel.presenceState.mockReturnValue({
			user1: [{ joined: '2021-01-02' }],
			user2: [{ joined: '2021-01-01' }]
		});
		const store = createOnlineUsersStore('room');

		const host = get(store.host);
		expect(host).toBe('user2');
	});

	test('online users should be updated when a user joins', () => {
		mockChannel.on.mockImplementation((event, _, cb) => event === 'presence' && cb());
		mockChannel.presenceState.mockReturnValue({
			user1: [{ joined: '2021-01-01' }],
			user2: [{ joined: '2021-01-02' }]
		});

		const store = createOnlineUsersStore('room');

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
		const store = createOnlineUsersStore('room');
		store.setVote('3');

		expect(mockChannel.track).toHaveBeenCalledWith(expect.objectContaining({ vote: '3' }));
	});

	test('when the host reveals votes, reveal is broadcast to all clients', () => {
		const store = createOnlineUsersStore('room');
		store.revealVotes(true);

		expect(mockChannel.send).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: true
			})
		);
	});

	test('when vote revealed broadcast is received the store is updated', () => {
		mockChannel.on.mockImplementation(
			(event, _, cb) => event === 'broadcast' && cb({ payload: true })
		);
		const store = createOnlineUsersStore('room');

		const revealed = get(store.votesRevealed);
		expect(revealed).toBe(true);
	});

	test('when a user leaves the channel should be unsubscribed from', () => {
		const store = createOnlineUsersStore('room');
		store.leave();

		expect(mockChannel.unsubscribe).toHaveBeenCalled();
	});

	test('when all users have voted, allVoted store should return true', () => {
		mockChannel.on.mockImplementation((event, _, cb) => event === 'presence' && cb());
		mockChannel.presenceState.mockReturnValue({
			user1: [{ joined: '2021-01-01', vote: '1' }],
			user2: [{ joined: '2021-01-02', vote: '2' }]
		});

		const store = createOnlineUsersStore('room');

		const allVoted = get(store.allVoted);
		expect(allVoted).toBe(true);
	});
});
