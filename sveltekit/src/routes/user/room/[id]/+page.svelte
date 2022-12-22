<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/Card.svelte';
	import { createOnlineUsersStore } from '$lib/stores/online-users';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	import UserList from './components/UserList.svelte';
	import VoteGrid from './components/VoteGrid.svelte';

	export let data: PageData;

	const username = data.session?.user.email ?? 'Anonymous';

	const { votesRevealed, leave, currentVote, onlineUsers, setVote, revealVotes, host } =
		createOnlineUsersStore($page.params.id, username, data.avatar_url);

	onDestroy(() => {
		leave();
	});
</script>

<svelte:head>
	<title>Room {$page.params.id}</title>
</svelte:head>

<Card>
	<UserList users={$onlineUsers} />
	<VoteGrid
		users={$onlineUsers}
		vote={$currentVote}
		votesRevealed={$votesRevealed}
		on:vote={(e) => setVote(e.detail)}
	/>

	{#if $host === username}
		{#if $votesRevealed}
			<button class="btn btn-accent mt-3" on:click={() => revealVotes(false)}>Hide votes</button>
		{:else}
			<button class="btn btn-accent mt-3" on:click={() => revealVotes(true)}>Reveal votes</button>
		{/if}
	{/if}
</Card>
