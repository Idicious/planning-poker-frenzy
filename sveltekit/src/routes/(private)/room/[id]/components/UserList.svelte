<script lang="ts">
	import type { OnlineUser } from '$lib/stores/online-users';
	import UserIcon from './UserIcon.svelte';

	export let users: OnlineUser[];
</script>

<ul class="flex gap-2 justify-center mb-6">
	{#each users as user}
		<li>
			<UserIcon captureOrigin {user} />
		</li>
	{/each}
</ul>
