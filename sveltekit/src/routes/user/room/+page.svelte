<script lang="ts">
	import Link from '$lib/components/general/Link.svelte';
	import Card from '$lib/components/layout/Card.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Card>
	<Link href="/user/room/create">Create Room</Link>
	<h1 class="text-lg font-bold">My Rooms</h1>

	<ul class="flex flex-col">
		{#each data.rooms as room}
			<li>
				<Link href={`/user/room/${room.name}`}><span class="capitalize">{room.name}</span></Link>
			</li>
		{/each}
	</ul>
</Card>
