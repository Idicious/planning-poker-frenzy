<script lang="ts">
	import Link from '$lib/components/general/Link.svelte';
	import Card from '$lib/components/layout/Card.svelte';
	import { resizeImage } from '$lib/images/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: email = data.session?.user.email;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<Card>
	<div class="flex flex-col items-center">
		{#if data.avatar_url}
			<img
				src={resizeImage(data.avatar_url, 256, 256)}
				alt="profile_picture"
				class="w-64 h-64 rounded-full object-cover mb-6"
			/>
		{/if}
		{#if data.username}<h1 class="text-5xl font-bold mb-3">{data.username}</h1>{/if}
		{#if email}<p class="font-light text-gray-500 mb-3">{email}</p>{/if}
		{#if data.website}<a class="link" href={data.website}>{data.website}</a>{/if}
	</div>
	<Link href="/user/profile/edit">Edit</Link>
</Card>
