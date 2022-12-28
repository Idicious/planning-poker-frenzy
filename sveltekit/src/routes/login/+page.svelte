<script lang="ts">
	import { goto } from '$app/navigation';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Card from '$lib/components/layout/Card.svelte';
	import { supabaseClient } from '$lib/db';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';

	export let email = '';
	export let password = '';
	export let authError = false;

	async function handleLogin() {
		const { error } = await supabaseClient.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			authError = true;
			return;
		}

		await goto('/');
	}

	async function handleGithub() {
		const { error } = await supabaseClient.auth.signInWithOAuth({
			provider: 'github',
			options: { redirectTo: window.location.origin }
		});

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

<Card>
	<section class="flex flex-col items-center mb-6">
		<h2 class="text-2xl text-center">Social logins</h2>
		<button class="btn btn-primary w-full text-center" on:click={handleGithub}>
			<Fa icon={faGithub} size="2x" fw class="inline mr-3" />
			Sign in with Github
		</button>
	</section>

	<section class="flex flex-col justify-center">
		<h2 class="text-2xl text-center">Email</h2>
		<form on:submit|preventDefault={handleLogin}>
			<TextInput
				bind:value={email}
				label="Email"
				name="email"
				type="email"
				placeholder="user@email.com"
				autocomplete="username"
			/>
			<TextInput
				bind:value={password}
				label="Password"
				name="password"
				type="password"
				autocomplete="current-password"
			/>
			<div class="flex">
				<button name="login" class="btn btn-primary" type="submit">Login</button>
				{#if authError}
					<div class="text-red-600 ml-3">Something went wrong</div>
				{/if}
			</div>
		</form>
	</section>
</Card>
