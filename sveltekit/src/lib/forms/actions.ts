import { applyAction } from '$app/forms';
import type { ActionResult } from '@sveltejs/kit';

/**
 * Can be used as a handler for felte's `onSubmit` prop when used with form actions.
 *
 * @param response
 * @returns
 */
export async function applyFormActionResponse(response: unknown) {
	if (!(response instanceof Response)) {
		throw new Error('Unexpected response');
	}

	const actionResult = (await response.json()) as ActionResult;
	return applyAction(actionResult);
}
