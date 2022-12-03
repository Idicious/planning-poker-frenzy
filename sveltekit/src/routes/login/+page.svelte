<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabaseClient } from '$lib/db';

	export let email = '';
	export let authError = false;

	async function handleLogin() {
		const { error } = await supabaseClient.auth.signInWithOtp({ email });

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

<div class="shadow-lg p-3 mt-3">
	<section class="flex flex-col items-center mb-6">
		<h2 class="text-2xl text-center">Social logins</h2>
		<button class="btn btn-primary w-full" on:click={handleGithub}>
			<i class="fa fa-github mr-3" />
			Sign in with Github
		</button>
	</section>

	<section class="flex flex-col justify-center">
		<h2 class="text-2xl text-center">Email</h2>
		<form on:submit|preventDefault={handleLogin}>
			<input
				class="block border-solid px-3 py-2 rounded border-2 border-black min-w-full mb-3"
				type="email"
				placeholder="Email"
				name="email"
				id="email"
				bind:value={email}
			/>
			<div class="flex">
				<button class="btn btn-primary" type="submit">Login</button>
				<a class="ml-1 underline" href="/register">Register</a>
				{#if authError}
					<div class="text-red-600 ml-3">Something went wrong</div>
				{/if}
			</div>
		</form>
	</section>
</div>
