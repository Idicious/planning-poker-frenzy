<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>Welcome to SvelteKit</h1>

{#if $page.data.session}
	<p>Logged in as {$page.data.session.user.email}</p>
{/if}

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
