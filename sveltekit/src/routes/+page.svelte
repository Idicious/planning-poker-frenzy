<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

{#if $page.data.session}
	<p>Logged in as {$page.data.session.user.email}</p>
{/if}

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
