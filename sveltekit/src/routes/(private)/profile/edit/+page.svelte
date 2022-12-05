<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import Card from '$lib/components/Card.svelte';
	import { createTouchTracking } from '$lib/forms/trackTouched';
	import { createValidator } from '$lib/forms/validation';
	import { ProfileDTOSchema, type ProfileDTO } from '$lib/schemas/profile';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const validateForm = createValidator(ProfileDTOSchema);
	const { trackTouched, touched } = createTouchTracking<ProfileDTO>({
		username: !browser,
		website: !browser
	});
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

{#if form?.success}
	<p class="text-green-500">Profile updated!</p>
{/if}

<Card>
	<img
		src={data.avatar_url}
		alt="profile_picture"
		class="w-64 h-64 rounded-full object-cover mx-auto"
	/>
	<form
		method="POST"
		enctype="multipart/form-data"
		use:trackTouched
		on:input={validateForm}
		use:enhance={({ form, cancel }) => {
			validateForm(form, cancel);
		}}
	>
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
				value={form?.username ?? data.username}
			/>
			{#if $touched.username && form?.errors?.username}
				<p class="text-red-600 text-sm">{form.errors.username[0]}</p>
			{/if}
		</div>
		<div class="py-2 mb-2">
			<label for="website">Website</label>
			<input
				class="block border-solid px-3 py-2 rounded border-2 min-w-full"
				placeholder="Website"
				name="website"
				value={form?.website ?? data.website}
			/>
			{#if form?.errors?.website}
				<p class="text-red-600 text-sm">{form.errors.website[0]}</p>
			{/if}
		</div>

		<button class="btn btn-primary" type="submit">Update</button>
		<a class="link" href="/profile">Cancel</a>
	</form>
</Card>
