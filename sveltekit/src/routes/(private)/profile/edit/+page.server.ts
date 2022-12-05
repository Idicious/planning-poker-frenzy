import { ProfileDTOSchema } from '$lib/schemas/profile';
import { authenticate, validate } from '$lib/server/handlers';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session } from '@supabase/supabase-js';
import { error as httpError, redirect, type Actions } from '@sveltejs/kit';
import sharp from 'sharp';

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
				const resizedImage = await resizeImage(avatar);
				const avatarUrl = await uploadAvatar(supabaseClient, session, resizedImage);
				await updateProfileWithAvatarUrl(supabaseClient, session, avatarUrl);
			}

			throw redirect(302, '/profile');
		})
	)
};

async function resizeImage(file: Blob) {
	const fileBuffer = await file.arrayBuffer();
	return await sharp(Buffer.from(fileBuffer)).resize(480, 480).webp().toBuffer();
}

async function uploadAvatar(supabaseClient: TypedSupabaseClient, session: Session, avatar: Buffer) {
	const avatarPath = `${session.user.id}/avatar.webp`;

	const { error } = await supabaseClient.storage.from('avatars').upload(avatarPath, avatar, {
		upsert: true,
		contentType: 'image/webp'
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
	const { error } = await supabaseClient
		.from('profiles')
		.update({ avatar_url: avatarPath })
		.eq('id', session.user.id);

	if (error != null) {
		console.error(error);
		throw httpError(500);
	}
}
