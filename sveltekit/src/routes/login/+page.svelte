<script lang="ts">
	import { SignInDTOSchema, type SignInDTO } from '$lib/auth/schemas';
	import { Submit, TextInput } from '$lib/components/form';
	import { Card } from '$lib/components/layout';
	import { applyFormActionResponse, applyFormErrorResponse } from '$lib/forms/actions';
	import type { TaggedActionData } from '$lib/forms/validation';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import type { ActionData } from './$types';
	import SocialLoginForm from './SocialLoginForm.svelte';

	export let form: ActionData;

	const {
		form: signInForm,
		errors: clientErrors,
		touched
	} = createForm<SignInDTO>({
		extend: validator({ schema: SignInDTOSchema }),
		onSuccess: applyFormActionResponse,
		onError: applyFormErrorResponse
	});

	type LoginActionData = TaggedActionData<'login', ActionData>;
	$: errors = (form as LoginActionData)?.errors ?? $clientErrors;
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<Card>
	<SocialLoginForm />

	<section class="flex flex-col justify-center">
		<h2 class="text-2xl text-center">Email</h2>

		{#if form?.authError}
			<div class="text-red-600 ml-3">Something went wrong</div>
		{/if}

		<form method="POST" action="?/login" use:signInForm>
			<div class="mb-3">
				<TextInput
					label="Email"
					name="email"
					type="email"
					placeholder="user@email.com"
					autocomplete="username"
					required
					errors={errors?.email}
					touched={$touched.email}
				/>
			</div>
			<div class="mb-3">
				<TextInput
					label="Password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					minlength={SignInDTOSchema.shape.password.minLength}
					errors={errors?.password}
					touched={$touched.password}
				/>
			</div>
			<Submit>Login</Submit>
		</form>
	</section>
</Card>
