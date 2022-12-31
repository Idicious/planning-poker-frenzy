<script lang="ts">
	import FileInput from '$lib/components/form/FileInput.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Card from '$lib/components/layout/Card.svelte';
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

	$: initialData = { ...data, ...form };
	$: errors = form?.errors ?? $clientErrors;
	$: selectedImage = $formData.avatar;

	$: selectedFileUrl = selectedImage ? URL.createObjectURL(selectedImage) : null;
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
			<FileInput name="avatar" label="Avatar" accept="image/*" />
		</div>
		<div class="py-2">
			<TextInput
				name="username"
				value={initialData.username ?? ''}
				label="Username"
				placeholder="Username"
				touched={$touched.username}
				errors={errors.username}
			/>
		</div>
		<div class="py-2 mb-2">
			<TextInput
				name="website"
				value={initialData.website ?? ''}
				label="Website"
				type="url"
				placeholder="https://example.com"
				touched={$touched.website}
				errors={errors.website}
			/>
		</div>

		<button class="btn btn-primary" type="submit">Update</button>
		<a class="link" href="/user/profile">Cancel</a>
	</form>
</Card>
