import { writable } from 'svelte/store';

export const voteStore = writable<null | number | string>(null);
