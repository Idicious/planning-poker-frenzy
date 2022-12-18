import type { OnlineUser } from '$lib/stores/online-users';
import { userIconPositionStore } from '$lib/stores/user-icon-positions';
import { render } from '@testing-library/svelte';
import html from 'svelte-htm';
import { get } from 'svelte/store';
import { describe, expect, test } from 'vitest';
import UserIcon from './UserIcon.svelte';

const user = { email: 'test@test.com' } as OnlineUser;

describe('UserIcon', () => {
	test('should render user abbreviation', () => {
		const { getByText } = render(html`<${UserIcon} user=${user} />`);
		expect(getByText('TE')).toBeDefined();
	});

	test('should render user email', () => {
		const { getByText } = render(html`<${UserIcon} user=${user} />`);
		expect(getByText('test@test.com')).toBeDefined();
	});

	test('should capture origin', () => {
		render(html`<${UserIcon} user=${user} captureOrigin />`);

		const origin = get(userIconPositionStore.origin)[user.email];
		expect(origin).toBeDefined();
	});

	test('should update position', () => {
		const { getByTestId } = render(html`<${UserIcon} user=${user} />`);
		const container = getByTestId('user-icon-container');

		container.dispatchEvent(new CustomEvent('introend'));

		const last = get(userIconPositionStore.last)[user.email];
		expect(last).toBeDefined();
	});
});
