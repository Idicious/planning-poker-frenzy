<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
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

<form
	method="POST"
	use:trackTouched
	on:input={validateForm}
	use:enhance={({ form, cancel }) => {
		validateForm(form, cancel);
	}}
>
	<div>
		<label for="email"><strong>Email: </strong></label>
		<span name="email">{data.session?.user.email}</span>
	</div>
	<div>
		<label for="username">Username</label>
		<input
			class="block border-solid px-3 py-2 rounded border-2 min-w-full mb-3"
			placeholder="Username"
			name="username"
			value={form?.username ?? data.username}
		/>
		{#if $touched.username && form?.errors?.username}
			<p class="text-red-600 text-sm">{form.errors.username[0]}</p>
		{/if}
	</div>
	<div>
		<label for="website">Website</label>
		<input
			class="block border-solid px-3 py-2 rounded border-2 min-w-full mb-3"
			placeholder="Website"
			name="website"
			value={form?.website ?? data.website}
		/>
		{#if form?.errors?.website}
			<p class="text-red-600 text-sm">{form.errors.website[0]}</p>
		{/if}
	</div>

	<Button type="submit">Update</Button>
</form>
