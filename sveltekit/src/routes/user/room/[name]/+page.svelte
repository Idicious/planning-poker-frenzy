<script lang="ts">
	import Card from '$lib/components/layout/Card.svelte';
	import { createOnlineUsersStore } from '$lib/stores/online-users';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';

	import UserList from './components/UserList.svelte';
	import VoteGrid from './components/VoteGrid.svelte';

	export let data: PageData;

	const username = data.session.user.email ?? 'Anonymous';

	const { votesRevealed, leave, currentVote, onlineUsers, setVote, revealVotes, host } =
		createOnlineUsersStore(data.room.id, username, data.avatarUrl);

	onDestroy(() => {
		leave();
	});
</script>

<svelte:head>
	<title>Room {data.room.name}</title>
</svelte:head>

<!-- <aside class="absolute left-0 top-0 md:w-80 w-full bg-white h-full p-3 z-100">
	<section class="flex flex-col">
		<h1 class="text-lg font-bold">Polls</h1>
		<ul class="flex flex-col">
			{#each data.room.polls as poll}
				<li>
					<a href="/poll">{poll.name}</a>
				</li>
			{/each}
		</ul>
	</section>
</aside> -->

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
