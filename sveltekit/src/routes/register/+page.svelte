<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	export let email = '';
	export let password = '';
	export let repeat = '';

	$: emailValid = /\w+@\w+\.com/.test(email);
	$: passwordsMatch = password === repeat;
	$: passwordLength = password.length >= 8;

	$: formValid = emailValid && passwordsMatch && passwordLength;

	export let authError = false;

	async function handleRegistration() {
		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			authError = true;
			return;
		}

		await goto('/');
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

{#if authError}
	<div class="error">Something went wrong</div>
{/if}

<div class="container rounded-md shadow-md br-2">
	<form on:submit|preventDefault={handleRegistration}>
		<label class="block" for="email">Email</label>
		<input
			class="block border-solid rounded border-2 border-black"
			type="email"
			name="email"
			id="email"
			bind:value={email}
		/>

		<label class="block" for="password">Password</label>
		<input
			class="block border-solid rounded border-2 border-black"
			type="password"
			name="password"
			id="password"
			bind:value={password}
		/>

		<label class="block" for="repeat">Repeat password</label>
		<input
			class="block border-solid rounded border-2 border-black"
			type="password"
			name="repeat"
			id="repeat"
			bind:value={repeat}
		/>

		<button
			class="rounded px-3 py-1 mt-3 disabled:bg-gray-500 bg-blue-400"
			disabled={!formValid}
			type="submit">Register</button
		>
	</form>
</div>
