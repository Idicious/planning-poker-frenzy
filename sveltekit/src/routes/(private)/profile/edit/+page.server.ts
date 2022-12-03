import { ProfileDTOSchema } from '$lib/schemas/profile';
import { authenticate, validate } from '$lib/server/handlers';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session } from '@supabase/supabase-js';
import { error as httpError, redirect, type Actions } from '@sveltejs/kit';

type AuthenticatedSupabase = {
	supabaseClient: TypedSupabaseClient;
	session: Session;
};

export const actions: Actions = {
	default: authenticate(
		validate(ProfileDTOSchema, async (event, formData) => {
			const { supabaseClient, session } = (await getSupabase(event)) as AuthenticatedSupabase;

			const { avatar, ...profile } = formData;

			const { error } = await supabaseClient
				.from('profiles')
				.update(profile)
				.eq('id', session.user.id);

			if (error != null) {
				console.error(error);
				throw httpError(500);
			}

			if (avatar.size > 0) {
				const avatarUrl = await uploadAvatar(supabaseClient, session, avatar);
				await updateProfileWithAvatarUrl(supabaseClient, session, avatarUrl);
			}

			throw redirect(302, '/profile');
		})
	)
};

async function uploadAvatar(supabaseClient: TypedSupabaseClient, session: Session, file: Blob) {
	const avatarPath = `${session.user.id}/avatar`;

	const { error } = await supabaseClient.storage.from('avatars').upload(avatarPath, file, {
		upsert: true,
		contentType: file.type
	});

	if (error) {
		console.error(error);
		throw httpError(500);
	}

	return supabaseClient.storage.from('avatars').getPublicUrl(avatarPath).data.publicUrl;
}

async function updateProfileWithAvatarUrl(
	supabaseClient: TypedSupabaseClient,
	session: Session,
	avatarPath: string
) {
	const { data } = supabaseClient.storage.from('avatars').getPublicUrl(avatarPath);

	const { error } = await supabaseClient
		.from('profiles')
		.update({ avatar_url: data.publicUrl })
		.eq('id', session.user.id);

	if (error != null) {
		console.error(error);
		throw httpError(500);
	}
}
