import { writable } from 'svelte/store';

export const userIconPositionStore = createUserIconPositionStore();
function createUserIconPositionStore() {
	const origin = writable<{ [key: string]: DOMRect }>({});
	const last = writable<{ [key: string]: DOMRect }>({});

	return {
		origin: { subscribe: origin.subscribe },
		last: { subscribe: last.subscribe },
		resetLast: () => last.update(() => ({})),
		resetAll: () => {
			origin.update(() => ({}));
			last.update(() => ({}));
		},
		setOrigin: (userId: string, position: DOMRect) => {
			origin.update((store) => ({ ...store, [userId]: position }));
		},
		setLast: (userId: string, position: DOMRect) => {
			last.update((store) => ({ ...store, [userId]: position }));
		}
	};
}
