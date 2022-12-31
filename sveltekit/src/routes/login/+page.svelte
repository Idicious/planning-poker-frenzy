<script lang="ts">
	import SocialLoginForm from './SocialLoginForm.svelte';

	import { enhance } from '$app/forms';
	import { Submit, TextInput } from '$lib/components/form';
	import { Card } from '$lib/components/layout';
	import type { ActionData } from './$types';

	export let form: ActionData;
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

		<form method="POST" action="?/login" use:enhance>
			<div class="mb-3">
				<TextInput
					label="Email"
					name="email"
					type="email"
					placeholder="user@email.com"
					autocomplete="username"
					required
				/>
			</div>
			<div class="mb-3">
				<TextInput
					label="Password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/>
			</div>
			<Submit>Login</Submit>
		</form>
	</section>
</Card>
