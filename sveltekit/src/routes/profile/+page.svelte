<script lang="ts">
	import { page } from '$app/stores';

	async function updateProfile() {}
</script>

<form class="form-widget" on:submit|preventDefault={updateProfile}>
	<div>
		<label for="email">Email</label>
		<input id="email" type="text" value={$page.data.session?.user.email} disabled />
	</div>
	<div>
		<label for="username">Name</label>
		<input id="username" type="text" />
	</div>
	<div>
		<label for="website">Website</label>
		<input id="website" type="website" />
	</div>

	<div>
		<input type="submit" class="button block primary" value={'Update'} />
	</div>
</form>
