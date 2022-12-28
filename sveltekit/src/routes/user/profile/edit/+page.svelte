<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { applyFormActionResponse } from '$lib/forms/actions';
	import { ProfileDTOSchema, type ProfileDTO } from '$lib/profile/schemas';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const {
		form: profileForm,
		data: formData,
		errors: clientErrors,
		touched
	} = createForm<ProfileDTO>({
		extend: validator({ schema: ProfileDTOSchema }),
		onSuccess: applyFormActionResponse
	});

	$: errors = form?.errors ?? $clientErrors;
	$: initialData = { ...data, ...form };

	$: selectedFileUrl = $formData.avatar ? URL.createObjectURL($formData.avatar) : null;
</script>

<svelte:head>
	<title>Edit Profile</title>
</svelte:head>

<Card>
	<img
		src={selectedFileUrl ?? data.avatar_url}
		alt="profile_picture"
		class="w-64 h-64 rounded-full object-cover mx-auto"
	/>
	<form use:profileForm method="POST" enctype="multipart/form-data">
		<div class="py-2">
			<label for="file" class="block">Avatar</label>
			<input type="file" name="avatar" accept="image/*" />
		</div>
		<div class="py-2">
			<label for="username">Username</label>
			<input
				class="block border-solid px-3 py-2 rounded border-2 min-w-full"
				placeholder="Username"
				name="username"
				value={initialData.username}
			/>
			{#if $touched.username && errors?.username}
				<p class="text-red-600 text-sm">{errors.username[0]}</p>
			{/if}
		</div>
		<div class="py-2 mb-2">
			<label for="website">Website</label>
			<input
				class="block border-solid px-3 py-2 rounded border-2 min-w-full"
				placeholder="Website"
				name="website"
				value={initialData.website}
			/>
			{#if errors?.website}
				<p class="text-red-600 text-sm">{errors.website[0]}</p>
			{/if}
		</div>

		<button class="btn btn-primary" type="submit">Update</button>
		<a class="link" href="/user/profile">Cancel</a>
	</form>
</Card>
