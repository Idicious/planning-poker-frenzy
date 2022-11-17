<script lang="ts">
	import { onlineUsers, allVoted } from '$lib/stores/online-users';
</script>

<h1>Online users</h1>
<ul>
	{#each $onlineUsers.users as { email, vote }}
		<li class:border-green-500={vote != null}>{$allVoted ? `${email}: ${vote}` : email}</li>
	{/each}
</ul>
