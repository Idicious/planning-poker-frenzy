<script lang="ts">
	import { supabaseClient } from '$lib/db';
	import { goto } from '$app/navigation';

	export let password = '';
	export let repeat = '';
	export let authError = false;

	$: passwordMatch = password === repeat;
	$: passwordValid = password.length >= 8;
	$: formValid = passwordMatch && passwordValid;

	async function handleReset() {
		const { error } = await supabaseClient.auth.updateUser({ password });

		if (error) {
			authError = true;
			return;
		}

		await supabaseClient.auth.signOut();
		await goto('/login');
	}
</script>

<svelte:head>
	<title>Reset password</title>
</svelte:head>

{#if authError}
	<div class="error">Something went wrong</div>
{/if}

<div class="container rounded-md shadow-md br-2">
	<form on:submit|preventDefault={handleReset}>
		<label class="block" for="email">Password</label>
		<input
			class="block border-solid rounded border-2 border-black"
			type="email"
			name="email"
			id="email"
			bind:value={password}
		/>

		<label class="block" for="password">Repeat</label>
		<input
			class="block border-solid rounded border-2 border-black"
			type="password"
			name="password"
			id="password"
			bind:value={repeat}
		/>

		<button disabled={formValid} type="submit">Reset</button>
	</form>
</div>
