<script lang="ts">
	import type { OnlineUser } from '$lib/stores/online-users';
	import GridItem from './GridItem.svelte';

	export let users: OnlineUser[] = [];
	export let vote: number | string | null = null;
	export let votesRevealed = false;

	const values = [1, 2, 3, 5, 8, 13, 20, 'Koffie', '?'];
</script>

<div class="grid grid-cols-3 gap-2">
	{#each values as value}
		<GridItem {vote} {votesRevealed} {value} {users} on:vote />
	{/each}
</div>
