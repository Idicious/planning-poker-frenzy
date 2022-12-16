<script lang="ts">
	import { page } from '$app/stores';
	import { onlineUsers } from '$lib/stores/online-users';
</script>

{#if $onlineUsers.host === $page.data.session?.user.email}
	<p><strong>You are host</strong></p>
{/if}
