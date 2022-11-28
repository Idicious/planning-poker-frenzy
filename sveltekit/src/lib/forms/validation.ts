import { applyAction } from '$app/forms';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import type { z } from 'zod';

type FormEvent = Event & { currentTarget: HTMLFormElement };

function isFormElement(node: unknown): node is HTMLFormElement {
	return node instanceof HTMLFormElement;
}

function isNamedEvent(event: unknown): event is Event & { target: { name: string } } {
	return event instanceof Event && event.target != null && 'name' in event.target;
}

function getCurrentErrors(pageStore: typeof page): Record<string, string[] | undefined> {
	return get(pageStore).form?.errors ?? {};
}

export function createValidator(schema: z.ZodSchema) {
	return async function (node: HTMLFormElement | FormEvent, cancel?: () => void) {
		const isForm = isFormElement(node);
		const namedEvent = isNamedEvent(node);
		const form = isForm ? node : node.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		const validationResult = namedEvent
			? await schema.safeParseAsync(data, { path: [node.target.name] })
			: await schema.safeParseAsync(data);

		if (validationResult.success) {
			if (namedEvent) {
				const errors = getCurrentErrors(page);
				delete errors[node.target.name];

				applyAction({
					status: 200,
					type: 'success',
					data: { success: false, errors }
				});
			} else {
				applyAction({ status: 200, type: 'success', data: { success: false } });
			}
		} else {
			if (cancel) cancel();

			const errors = validationResult.error.flatten().fieldErrors;

			if (namedEvent) {
				console.log('named event', errors);
				const currentErrors = getCurrentErrors(page);
				applyAction({
					status: 400,
					type: 'invalid',
					data: { success: false, errors: { ...currentErrors, ...errors } }
				});
			} else {
				console.log('form event', errors);
				applyAction({ status: 400, type: 'invalid', data: { success: false, errors } });
			}
		}

		return validationResult.success;
	};
}
