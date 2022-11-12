<script lang="ts">
	import { user } from '$lib/stores/user';
</script>

<h1>Welcome to SvelteKit</h1>

{#if $user}
	<p>Logged in as {$user.email}</p>
{/if}

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
