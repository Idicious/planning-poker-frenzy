<script lang="ts">
	import SocialLogin from './SocialLogin.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<section class="flex flex-col items-center mb-6">
	<h2 class="text-2xl text-center">Social logins</h2>
	<SocialLogin provider="github" icon={faGithub}>Github</SocialLogin>
</section>
