import { ProfileDTOSchema } from '$lib/schemas/profile';
import { authenticate, validate } from '$lib/server/handlers';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: authenticate(
		validate(ProfileDTOSchema, async (event, formData) => {
			const { supabaseClient, session } = await getSupabase(event);

			const { error: err } = await supabaseClient
				.from('profiles')
				.update(formData)
				.eq('id', session?.user?.id);

			if (err != null) {
				throw error(500, err.message);
			}

			return { success: true, ...formData } as const;
		})
	)
};
