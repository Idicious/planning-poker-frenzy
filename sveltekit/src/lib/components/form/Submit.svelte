<script lang="ts">
	export let disabled = false;
</script>

<button
	type="submit"
	{disabled}
	class="px-6 py-2 rounded-md font-medium text-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-black text-white"
	><slot />
</button>
