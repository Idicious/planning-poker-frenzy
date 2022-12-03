<script>
	import '../app.css';

	import { supabaseClient } from '$lib/db';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const { data } = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			data.subscription.unsubscribe();
		};
	});

	async function handleLogout() {
		const { error } = await supabaseClient.auth.signOut();

		if (error) {
			console.error(error);
		}

		goto('/login');
	}
</script>

<header>
	<nav>
		<ul class="flex gap-2 justify-center">
			{#if $page.data.session}
				<li><a href="/profile">Profile</a></li>
				<li><button on:click={handleLogout}>Logout</button></li>
			{:else}
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			{/if}
		</ul>
	</nav>
</header>

<main class="flex justify-center">
	<div class="w-full md:max-w-4xl">
		<slot />
	</div>
</main>
