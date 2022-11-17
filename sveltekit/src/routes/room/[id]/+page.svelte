<script lang="ts">
	import { page } from '$app/stores';
	import { onlineUsers } from '$lib/stores/online-users';
	import { onDestroy, onMount } from 'svelte';

	import IsHost from './components/IsHost.svelte';
	import UserList from './components/UserList.svelte';
	import Vote from './components/Vote.svelte';

	onMount(() => {
		return onlineUsers.joinRoom($page.params.id, $page.data.session?.user.email);
	});

	onDestroy(() => {
		return onlineUsers.leave();
	});
</script>

<svelte:head>
	<title>Room {$page.params.id}</title>
</svelte:head>

<IsHost />
<Vote />
<UserList />
