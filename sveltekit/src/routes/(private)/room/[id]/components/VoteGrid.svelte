<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{ vote: string | number }>();

	const values = [1, 2, 3, 5, 8, 13, 20, 'Koffie', '?'];

	function vote(value: number | string) {
		dispatch('vote', value);
	}
</script>

<div class="grid grid-cols-3 gap-4">
	{#each values as value}
		<button
			on:click={() => vote(value)}
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{value}</button
		>
	{/each}
</div>
