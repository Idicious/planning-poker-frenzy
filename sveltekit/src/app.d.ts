// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare namespace App {
	interface Supabase {
		Database: import('./DatabaseDefinitions').Database;
		SchemaName: 'public';
	}
	interface Locals {
		session: import('@supabase/supabase-js').Session | null;
		sb: import('@supabase/supabase-js').SupabaseClient<import('./DatabaseDefinitions').Database>;
	}
	interface PageData {
		session: import('@supabase/supabase-js').Session | null;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

interface Navigator extends Navigator {
	connection?: {
		effectiveType: string;
	};
}

declare module '@fortawesome/pro-solid-svg-icons/index.es' {
	export * from '@fortawesome/pro-solid-svg-icons';
}
