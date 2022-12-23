import type { Database } from '$lib/db-types';
import { Tokens } from '$lib/di-tokens';
import { SupabaseClient, type Session } from '@supabase/supabase-js';
import { error as httpError } from '@sveltejs/kit';
import { inject, injectable } from 'inversify';
import sharp from 'sharp';

@injectable()
export class AvatarService {
	constructor(
		@inject(Tokens.Session) private readonly session: Session,
		@inject(SupabaseClient) private readonly supabase: SupabaseClient<Database>
	) {}

	async updateAvatar(avatar: Blob) {
		const resizedImage = await this.#resizeImage(avatar);
		const avatarUrl = await this.#uploadAvatar(resizedImage);
		await this.#updateProfileWithAvatarUrl(avatarUrl);
	}

	async #uploadAvatar(avatar: Buffer) {
		const time = new Date().getTime();
		const avatarPath = `${this.session.user.id}/avatar-${time}.webp`;

		const { error } = await this.supabase.storage.from('avatars').upload(avatarPath, avatar, {
			upsert: true,
			contentType: 'image/webp'
		});

		if (error) {
			throw httpError(500, 'Error uploading avatar');
		}

		return this.supabase.storage.from('avatars').getPublicUrl(avatarPath).data.publicUrl;
	}

	async #resizeImage(file: Blob) {
		const fileBuffer = Buffer.from(await file.arrayBuffer());
		return await sharp(fileBuffer).resize(480, 480).webp().toBuffer();
	}

	async #updateProfileWithAvatarUrl(avatarPath: string) {
		const { error } = await this.supabase
			.from('profiles')
			.update({ avatar_url: avatarPath })
			.eq('id', this.session.user.id);

		if (error != null) {
			throw httpError(500, 'Error updating profile with avatar url');
		}
	}
}
