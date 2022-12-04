<script lang="ts">
	import type { OnlineUser } from '$lib/stores/online-users';
	import { userIconPositionStore } from '$lib/stores/user-icon-positions';
	import { fade, fly } from 'svelte/transition';

	export let user: OnlineUser;
	export let captureOrigin = false;

	const { origin, last } = userIconPositionStore;

	let ownPosition = { x: 0, y: 0 } as DOMRect;

	$: userAbreviation = user.email.substring(0, 2).toUpperCase();

	$: originPosition = $origin[user.email] ?? ownPosition;
	$: lastPosition = $last[user.email] ?? originPosition;

	$: deltaPosition = {
		x: lastPosition.x - ownPosition.x,
		y: lastPosition.y - ownPosition.y
	};

	function setPositions(node: HTMLElement) {
		ownPosition = node.getBoundingClientRect();

		if (captureOrigin) {
			userIconPositionStore.setOrigin(user.email, ownPosition);
		}
	}

	function updatePosition(e: { currentTarget: HTMLDivElement }) {
		const position = e.currentTarget.getBoundingClientRect();
		userIconPositionStore.setLast(user.email, position);
	}
</script>

<div
	use:setPositions
	on:introend={updatePosition}
	in:fly={{ x: deltaPosition.x, y: deltaPosition.y }}
	out:fade|local={{ duration: 100 }}
	class="rounded-full border-solid border-4 w-16 h-16 flex items-center justify-center border-black bg-slate-800 text-white font-bold relative group"
	class:border-green-500={user.vote != null}
>
	<span
		class="absolute text-black -right-56 -top-6 hidden group-hover:block bg-white p-1 rounded shadow-sm z-10"
		>{user.email}</span
	>
	<span class="text-center">{userAbreviation}</span>
</div>
