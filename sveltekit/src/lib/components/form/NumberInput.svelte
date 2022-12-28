<script lang="ts">
	import { browser } from '$app/environment';

	export let name: string;
	export let label: string;
	export let value: number;
	export let placeholder: string | undefined = undefined;
	export let autocomplete: string | undefined = undefined;

	export let touched = false;
	export let errors: string[] | undefined = undefined;
</script>

<label for={name}>{label}</label>
<input
	bind:value
	class="block border-solid px-3 py-2 rounded border-2 border-black min-w-full mb-3"
	{autocomplete}
	{placeholder}
	{name}
	type="number"
/>

{#if (touched || !browser) && errors}
	<span class="text-red-500 text-sm">{errors[0]}</span>
{/if}
