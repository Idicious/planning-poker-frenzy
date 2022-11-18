<script lang="ts">
	import { page } from '$app/stores';
	import { ProfileDTOSchema, type ProfileDTO } from '$lib/schemas/profile';
	import { validator } from '@felte/validator-zod';
	import { browser } from '$app/environment';
	import { createForm } from 'felte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const {
		form: useForm,
		errors,
		touched
	} = createForm<ProfileDTO>({
		initialValues: {
			username: form?.data?.username ?? data?.username ?? undefined,
			website: form?.data?.website ?? data?.website ?? undefined
		},
		extend: validator({ schema: ProfileDTOSchema }),
		onError: (err) => {
			const actionData = err as ActionData;
			return actionData?.errors?.fieldErrors;
		}
	});
</script>

<form method="POST" class="form-widget" use:useForm>
	<div>
		<label for="email"><strong>Email: </strong></label>
		<span name="email">{$page.data.session?.user.email}</span>
	</div>
	<div>
		<label for="username">Username</label>
		<input name="username" type="text" />
		{#if ($touched.username || !browser) && $errors.username}
			<p class="error">{$errors.username[0]}</p>
		{/if}
	</div>
	<div>
		<label for="website">Website</label>
		<input name="website" type="website" />
		{#if ($touched.website || !browser) && $errors.website}
			<p class="error">{$errors.website[0]}</p>
		{/if}
	</div>

	<div>
		<button type="submit" class="button block primary">Update</button>
	</div>
</form>
