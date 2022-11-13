<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabaseClient } from '$lib/db';
	import { env } from '$env/dynamic/public';
	import Layout from '../+layout.svelte';

	export let email = '';
	export let password = '';
	export let authError = false;

	async function handleLogin() {
		const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

		if (error) {
			authError = true;
			return;
		}

		await goto('/');
	}

	async function handleGithub() {
		const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'github' });

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
	<button type="button" on:click={handleGithub}>Github</button>
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
