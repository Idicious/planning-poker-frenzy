<script lang="ts">
	import { page } from '$app/stores';
	import { ProfileDTOSchema, type ProfileDTO } from '$lib/schemas/profile';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;

	const { form, errors, touched } = createForm<ProfileDTO>({
		extend: validator({ schema: ProfileDTOSchema }),
		onError: (err) => {
			const actionData = err as ActionData;
			return actionData?.errors?.fieldErrors;
		}
	});
</script>

<form method="POST" class="form-widget" use:form>
	<div>
		<label for="email">Email</label>
		<span name="email">{$page.data.session?.user.email}</span>
	</div>
	<div>
		<label for="username">Name</label>
		<input name="username" type="text" value={data?.username} />
		{#if $touched.username && $errors.username}
			<p class="error">{$errors.username[0]}</p>
		{/if}
	</div>
	<div>
		<label for="website">Website</label>
		<input name="website" type="website" value={data?.website} />
		{#if $touched.website && $errors.website}
			<p class="error">{$errors.website[0]}</p>
		{/if}
	</div>

	<div>
		<button type="submit" class="button block primary">Update</button>
	</div>
</form>
