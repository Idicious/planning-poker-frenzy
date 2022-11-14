<script lang="ts">
	import { profile } from '$lib/stores/profile';
	import { page } from '$app/stores';

	$: data = $profile.data;
	$: username = data?.username ?? '';
	$: website = data?.website ?? '';
	$: loading = $profile.loading ?? '';

	async function updateProfile() {}
</script>

<form class="form-widget" on:submit|preventDefault={updateProfile}>
	<div>
		<label for="email">Email</label>
		<input id="email" type="text" value={$page.data.session?.user.email} disabled />
	</div>
	<div>
		<label for="username">Name</label>
		<input id="username" type="text" bind:value={username} />
	</div>
	<div>
		<label for="website">Website</label>
		<input id="website" type="website" bind:value={website} />
	</div>

	<div>
		<input
			type="submit"
			class="button block primary"
			value={$profile.loading ? 'Loading...' : 'Update'}
			disabled={loading}
		/>
	</div>
</form>
