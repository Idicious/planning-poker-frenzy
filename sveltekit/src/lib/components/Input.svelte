<script lang="ts">
	export let required = false;
	export let pattern: string | null | undefined = undefined;
	export let value: string | number | null = null;
	export let valid = true;
	export let type: string | null = null;
	export let placeholder = '';

	let touched = false;
	let dirty = false;

	$: error = !valid;

	$: showError = touched && error;
	$: showValid = touched && valid;

	function blur() {
		touched = true;
	}

	function change() {
		dirty = true;
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
			dirty = false;
		});
	}
</script>

<input
	use:reset
	use:setType
	on:blur={blur}
	on:change={change}
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
