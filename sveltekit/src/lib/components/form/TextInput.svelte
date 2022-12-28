<script lang="ts">
	import { browser } from '$app/environment';

	export let type: 'text' | 'password' | 'email' | 'tel' | 'url' = 'text';
	export let name: string;
	export let label: string;
	export let value: string | null | undefined;
	export let placeholder: string | undefined = undefined;
	export let autocomplete: string | undefined = undefined;

	export let touched = false;
	export let errors: string[] | null | undefined = undefined;

	$: _value = value ?? '';

	function setType(node: HTMLInputElement) {
		node.type = type;
	}
</script>

<label for={name}>
	<span>{label}</span>
	<input
		use:setType
		bind:value={_value}
		class="block border-solid px-3 py-2 rounded border-2 min-w-full"
		{autocomplete}
		{placeholder}
		{name}
	/>
</label>

{#if (touched || !browser) && errors?.[0]}
	<span class="text-red-500 text-sm">{errors[0]}</span>
{/if}
