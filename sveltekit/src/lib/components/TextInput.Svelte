<script lang="ts">
	export let required = false;
	export let pattern: string | null = null;
	export let value: string | null = null;
	export let valid = true;
	export let type: 'text' | 'email' | 'password' = 'text';
	export let placeholder = '';

	let touched = false;

	$: showError = touched && !valid;
	$: showValid = touched && valid;

	function blur() {
		touched = true;
	}

	function setType(node: HTMLInputElement) {
		if (type == null) return;
		node.type = type;
	}

	function reset(node: HTMLInputElement) {
		if (node.form == null) return;

		node.form.addEventListener('reset', () => {
			value = null;
			touched = false;
		});
	}
</script>

<input
	use:reset
	use:setType
	on:blur={blur}
	class:valid={showValid}
	class:error={showError}
	bind:value
	{required}
	{pattern}
	{placeholder}
	class=""
/>

<style>
	:host {
		display: block;
	}

	:host .valid {
		border-color: green;
	}

	:host .error {
		border-color: red;
	}
</style>
