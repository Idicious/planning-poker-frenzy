<script lang="ts">
	import type { OnlineUser } from '$lib/stores/online-users';
	import { userIconPositionStore } from '$lib/stores/user-icon-positions';
	import { fade, fly } from 'svelte/transition';

	export let user: OnlineUser;
	export let captureOrigin = false;

	const { origin, last } = userIconPositionStore;

	let ownPosition = { x: 0, y: 0 } as DOMRect;

	$: userAbbreviation = user.username.substring(0, 2).toUpperCase();

	$: originPosition = $origin[user.username] ?? ownPosition;
	$: lastPosition = $last[user.username] ?? originPosition;

	$: deltaPosition = {
		x: lastPosition.x - ownPosition.x,
		y: lastPosition.y - ownPosition.y
	};

	function setPositions(node: HTMLElement) {
		ownPosition = node.getBoundingClientRect();

		if (captureOrigin) {
			userIconPositionStore.setOrigin(user.username, ownPosition);
		}
	}

	function updatePosition() {
		userIconPositionStore.setLast(user.username, ownPosition);
	}
</script>

<figure
	use:setPositions
	on:introend={updatePosition}
	in:fly={{ x: deltaPosition.x, y: deltaPosition.y }}
	out:fade|local={{ duration: 100 }}
	class="rounded-full border-solid border-4 w-16 h-16 flex items-center justify-center border-black bg-slate-800 text-white font-bold relative group"
	class:border-green-500={user.vote != null}
>
	<figcaption
		class="absolute text-black left-full ml-2 -top-7 scale-0 group-hover:scale-100 bg-white p-1 rounded shadow-sm z-10 transition-all origin-left"
	>
		{user.username}
	</figcaption>
	{#if user.avatarUrl}
		<img src={user.avatarUrl} alt={user.username} class="rounded-full w-14 h-14" />
	{:else}
		<span>{userAbbreviation}</span>
	{/if}
</figure>
