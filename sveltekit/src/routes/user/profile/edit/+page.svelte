<script lang="ts">
	import FileInput from '$lib/components/form/FileInput.svelte';
	import Submit from '$lib/components/form/Submit.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Link from '$lib/components/general/Link.svelte';
	import Card from '$lib/components/layout/Card.svelte';
	import { applyFormActionResponse, applyFormErrorResponse } from '$lib/forms/actions';
	import { createImageStore } from '$lib/forms/images';
	import { resizeImage } from '$lib/images/utils';
	import {
		ProfileDTOSchema,
		USERNAME_MAX_LENGTH,
		USERNAME_MIN_LENGTH,
		type ProfileDTO
	} from '$lib/profile/schemas';
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
		onSuccess: applyFormActionResponse,
		onError: applyFormErrorResponse
	});

	$: initialValues = form?.formData ?? data.profile;
	$: errors = form?.errors ?? $clientErrors;
	$: selectedImage = $formData.avatar;

	const imageStore = createImageStore();
	$: if (selectedImage) {
		imageStore.set(selectedImage);
	}
</script>

<svelte:head>
	<title>Edit Profile</title>
</svelte:head>

<Card>
	<img
		src={$imageStore ?? resizeImage(data.profile.avatar_url, 256, 256)}
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
				label="Username"
				placeholder="Username"
				touched={$touched.username}
				errors={errors.username}
				required
				value={initialValues.username}
				minlength={USERNAME_MIN_LENGTH}
				maxlength={USERNAME_MAX_LENGTH}
			/>
		</div>
		<div class="py-2 mb-2">
			<TextInput
				name="website"
				label="Website"
				type="url"
				placeholder="https://example.com"
				value={initialValues.website}
				touched={$touched.website}
				errors={errors.website}
			/>
		</div>

		<Submit>Update</Submit>
		<Link href="/user/profile">Cancel</Link>
	</form>
</Card>
