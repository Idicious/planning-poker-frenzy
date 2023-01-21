import { get, writable } from 'svelte/store';

/**
 * Create a store that holds the object URL of an image blob, manages creating and revoking the URL
 */
export function createImageStore() {
	const imageStore = writable<string | null>(null);

	return {
		subscribe: imageStore.subscribe,
		set: (image: Blob) => {
			const currentUrl = get(imageStore);
			if (currentUrl) URL.revokeObjectURL(currentUrl);

			imageStore.set(URL.createObjectURL(image));
		}
	};
}
