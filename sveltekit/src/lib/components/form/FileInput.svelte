<script lang="ts">
	export let name: string;
	export let label: string;
	export let accept: string | undefined = undefined;
</script>

<label for={name} class="block">{label}</label>
<input type="file" {name} {accept} />
