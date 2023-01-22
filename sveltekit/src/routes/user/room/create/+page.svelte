<script lang="ts">
	import Submit from '$lib/components/form/Submit.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Card from '$lib/components/layout/Card.svelte';
	import { applyFormActionResponse, applyFormErrorResponse } from '$lib/forms/actions';
	import { validateName } from '$lib/room/room.client';
	import { CreateRoomDTOSchema, type CreateRoomDTO } from '$lib/room/schemas';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	const {
		form: createRoomForm,
		errors,
		touched,
		isValidating
	} = createForm<CreateRoomDTO>({
		extend: validator({
			schema: CreateRoomDTOSchema
		}),
		debounced: {
			timeout: 500,
			validate: validateName
		},
		onSuccess: applyFormActionResponse,
		onError: applyFormErrorResponse
	});
</script>

<Card>
	<h1 class="text-lg font-bold">Create Room</h1>

	<form method="POST" use:createRoomForm>
		<TextInput
			label="Name"
			name="name"
			errors={form?.errors.name ?? $errors.name}
			touched={$touched.name}
			value={form?.data.name}
		/>
		<Submit disabled={$isValidating}>Submit</Submit>
	</form>
</Card>
