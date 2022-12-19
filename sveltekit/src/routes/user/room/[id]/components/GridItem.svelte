<script lang="ts">
	import type { OnlineUser } from '$lib/stores/online-users';
	import { createEventDispatcher } from 'svelte';
	import UserIcon from './UserIcon.svelte';

	const dispatch = createEventDispatcher<{ vote: string }>();

	export let value: string;
	export let votesRevealed = false;
	export let users: OnlineUser[] = [];
	export let vote: number | string | null = null;

	$: usersWithVote = users.filter((user) => user.vote === value);

	function doVote() {
		dispatch('vote', value);
	}
</script>

<button
	on:click={doVote}
	class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
	class:bg-orange-500={vote === value}
	class:hover:bg-orange-500={vote === value}
>
	<div class="h-16">
		{#if votesRevealed}
			{#each usersWithVote as user}
				<UserIcon {user} />
			{/each}
		{/if}
	</div>
	{value}
</button>
