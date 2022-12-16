<script lang="ts">
	import '../app.css';

	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/db';
	import { inject } from '@vercel/analytics';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { webVitals } from '$lib/vitals';

	const analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

	$: if (browser && analyticsId) {
		inject();
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId
		});
	}

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
				<li><a href="/user/profile">Profile</a></li>
				<li><button on:click={handleLogout}>Logout</button></li>
			{:else}
				<li><a href="/login">Login</a></li>
			{/if}
		</ul>
	</nav>
</header>

<main class="flex justify-center">
	<div class="w-full md:max-w-4xl">
		<slot />
	</div>
</main>
