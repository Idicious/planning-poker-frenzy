<script lang="ts">
	import { browser } from '$app/environment';

	export let type: 'text' | 'password' | 'email' | 'tel' | 'url' = 'text';
	export let name: string;
	export let id = name;
	export let label: string | undefined = undefined;
	export let value: string | null | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let autocomplete: string | undefined = undefined;

	export let required = false;
	export let minlength: number | null | undefined = undefined;
	export let maxlength: number | null | undefined = undefined;
	export let pattern: string | null | undefined = undefined;

	export let touched = false;
	export let errors: string[] | null | undefined = undefined;

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		value = e.currentTarget.value;
	}
</script>

<label for={id}>
	<span>{label}</span>
	<input
		class="block border-solid px-3 py-2 rounded border-2 min-w-full"
		{autocomplete}
		{placeholder}
		{name}
		{id}
		{type}
		{required}
		value={value ?? ''}
		{minlength}
		{maxlength}
		{pattern}
		on:input={handleInput}
	/>
</label>

{#if (touched || !browser) && errors?.[0]}
	<span class="text-red-500 text-sm">{errors[0]}</span>
{/if}
