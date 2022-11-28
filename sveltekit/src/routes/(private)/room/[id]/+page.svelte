<script lang="ts">
	import { page } from '$app/stores';
	import { onlineUsers } from '$lib/stores/online-users';
	import { voteStore } from '$lib/stores/vote';
	import { onDestroy, onMount } from 'svelte';

	import IsHost from './components/IsHost.svelte';
	import UserList from './components/UserList.svelte';
	import VoteGrid from './components/VoteGrid.svelte';

	onMount(() => {
		return onlineUsers.joinRoom($page.params.id, $page.data.session?.user.email);
	});

	onDestroy(() => {
		return onlineUsers.leave();
	});

	function handleVote(e: CustomEvent<string | number>) {
		$voteStore = e.detail;
	}
</script>

<svelte:head>
	<title>Room {$page.params.id}</title>
</svelte:head>

<IsHost />
<UserList />
<VoteGrid on:vote={handleVote} />
