<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/Card.svelte';
	import { onlineUsers } from '$lib/stores/online-users';
	import { onDestroy, onMount } from 'svelte';

	import UserList from './components/UserList.svelte';
	import VoteGrid from './components/VoteGrid.svelte';

	let { votesRevealed, leave, joinRoom, currentVote } = onlineUsers;

	$: revealed = $votesRevealed;
	$: users = $onlineUsers.users;
	$: vote = $currentVote;

	onMount(() => {
		joinRoom($page.params.id, $page.data.session?.user.email);
	});

	onDestroy(() => {
		leave();
	});

	function handleVote(e: CustomEvent<string | number>) {
		onlineUsers.setVote(e.detail);
	}

	function revealVotes() {
		onlineUsers.revealVotes(true);
	}

	function hideVotes() {
		onlineUsers.revealVotes(false);
	}
</script>

<svelte:head>
	<title>Room {$page.params.id}</title>
</svelte:head>

<Card>
	<UserList {users} />
	<VoteGrid {users} {vote} votesRevealed={revealed} on:vote={handleVote} />

	{#if $onlineUsers.host === $page.data.session?.user.email}
		{#if revealed}
			<button class="btn btn-accent mt-3" on:click={hideVotes}>Hide votes</button>
		{:else}
			<button class="btn btn-accent mt-3" on:click={revealVotes}>Reveal votes</button>
		{/if}
	{/if}
</Card>
