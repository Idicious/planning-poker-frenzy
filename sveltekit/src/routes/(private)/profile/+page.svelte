<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<Card>
	<img
		src={data.avatar_url}
		alt="profile_picture"
		class="w-64 h-64 rounded-full object-cover mx-auto"
	/>
	<div class="py-2">
		<label for="email"><strong>Email: </strong></label>
		<span>{data.session?.user.email}</span>
	</div>
	<div class="py-2">
		<label for="username"><strong>Username:</strong></label>
		<span>{data.username}</span>
	</div>
	<div class="py-2 mb-3">
		<label for="website"><strong>Website:</strong></label>
		<span>{data.website}</span>
	</div>
	<a class="link" href="/profile/edit">Edit</a>
</Card>
