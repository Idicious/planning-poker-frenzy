import { render } from '@testing-library/svelte';
import html from 'svelte-htm';
import { describe, expect, test } from 'vitest';
import Card from './Card.svelte';

describe('Card', () => {
	test('should render', () => {
		const { getByText } = render(html`<${Card}><p>Slot content</p></${Card}>`);
		expect(getByText('Slot content')).toBeDefined();
	});
});
