<script lang="ts">
	export let icon: string | undefined = undefined;
	export let text = '';
	export let type = 'button';
	export let disabled = false;
	export let fullWidth = false;
</script>

<button
	on:click
	{type}
	{disabled}
	class="px-6 py-2 rounded-md font-medium text-lg hover:outline outline-black bg-blue-500"
	class:w-full={fullWidth}
>
	{#if icon}
		<i class="fa fa-{icon} mr-3" />
	{/if}

	{text}
</button>
