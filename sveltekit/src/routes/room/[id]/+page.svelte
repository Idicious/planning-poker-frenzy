<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { createIsHostStore, createOnlineUsersStore } from '$lib/stores/users';

	export let data: PageData;

	const userStore = createOnlineUsersStore(data.room, $page.data.session?.user.email);
	const isHostStore = createIsHostStore(userStore);
</script>

<svelte:head>
	<title>{data.room}</title>
</svelte:head>

Active users
<ul>
	{#each $userStore as user}
		<li>{user.presence_ref}</li>
	{/each}
</ul>
