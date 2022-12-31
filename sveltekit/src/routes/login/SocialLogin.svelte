<script lang="ts">
	import { enhance } from '$app/forms';
	import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';
	import type { Provider } from '@supabase/supabase-js';
	import Fa from 'svelte-fa';

	export let provider: Provider;
	export let icon: IconDefinition;
</script>

<form method="POST" action="?/social" use:enhance>
	<input type="hidden" name="provider" value={provider} />
	<button
		class="flex rounded-md bg-slate-300 px-6 py-2 items-center font-medium text-lg"
		type="submit"
	>
		<Fa {icon} size="2x" fw class="inline mr-3" />
		<span><slot /></span>
	</button>
</form>
