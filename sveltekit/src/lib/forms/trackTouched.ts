import { writable } from 'svelte/store';

export const createTouchTracking = <T>(
	initialValues: Partial<{ [K in keyof T]: boolean }> = {}
) => {
	const { update, subscribe, set } = writable(initialValues);

	function focusOut({ target }: FocusEvent) {
		if (target instanceof HTMLInputElement) {
			update((touched) => ({ ...touched, [target.name]: true }));
		}
	}

	function reset() {
		set({});
	}

	function trackTouched(form: HTMLFormElement) {
		form.addEventListener('focusout', focusOut);
		form.addEventListener('reset', reset);

		return {
			destroy() {
				form.removeEventListener('focusout', focusOut);
				form.removeEventListener('reset', reset);
			}
		};
	}

	return { trackTouched, touched: { subscribe } };
};
