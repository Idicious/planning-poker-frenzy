<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	export let email = '';
	export let password = '';
	export let authError = false;

	async function handleLogin() {
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			authError = true;
			return;
		}

		await goto('/');
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

{#if authError}
	<div class="error">Something went wrong</div>
{/if}

<div class="container rounded-md shadow-md br-2">
	<form on:submit|preventDefault={handleLogin}>
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

		<button type="submit">Login</button>
	</form>
</div>
