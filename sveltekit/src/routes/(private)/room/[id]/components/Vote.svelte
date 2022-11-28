<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { voteStore } from '$lib/stores/vote';

	let vote: number | null = null;

	function submitVote() {
		$voteStore = vote;
	}
</script>

<input class="block" type="number" placeholder="Your vote" bind:value={vote} />
<Button on:click={submitVote}>Submit vote</Button>
