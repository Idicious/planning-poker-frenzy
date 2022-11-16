<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { createIsHostStore, createOnlineUsersStore } from '$lib/stores/users';
	import { voteStore } from '$lib/stores/vote';

	const userStore = createOnlineUsersStore($page.params.id, $page.data.session?.user.email);
	const isHostStore = createIsHostStore(userStore);

	$: users = $userStore;
	$: allVoted = users.every((user) => user.vote != null);

	let vote: number | null = null;

	function submitVote() {
		$voteStore = vote;
	}
</script>

<svelte:head>
	<title>Room {$page.params.id}</title>
</svelte:head>

<h1>Active users</h1>

<input class="block" type="number" placeholder="Your vote" bind:value={vote} />
<Button on:click={submitVote}>Submit vote</Button>

{#if $isHostStore}
	<p><strong>You are host</strong></p>
{/if}

<ul>
	{#each users as { email, vote }}
		<li class:border-green-500={vote != null}>{allVoted ? `${email}: ${vote}` : email}</li>
	{/each}
</ul>
