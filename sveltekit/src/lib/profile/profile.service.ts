import type { ProfileUpdate } from '$lib/db-types';
import { Tokens } from '$lib/di-tokens';
import type { Database } from '$lib/generated-db-types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { error as httpError } from '@sveltejs/kit';
import { inject, injectable } from 'inversify';
import { ImageService } from './image.service';

@injectable()
export class ProfileService {
	constructor(
		@inject(Tokens.Session) private readonly session: Session,
		@inject(Tokens.Supabase) private readonly supabase: SupabaseClient<Database>,
		@inject(ImageService) private readonly imageService: ImageService
	) {}

	async getProfile() {
		const { error, data } = await this.supabase
			.from('profiles')
			.select('*')
			.eq('id', this.session.user.id)
			.single();

		if (error) {
			throw httpError(500, 'Error fetching profile');
		}

		return data;
	}

	async updateProfile(profile: ProfileUpdate, avatarImage?: Blob) {
		if (avatarImage == null || avatarImage.length <= 0) {
			return await this.#updateProfile(profile);
		}

		const { url: avatar_url } = await this.#uploadAvatar(avatarImage);
		return await this.#updateProfile({ ...profile, avatar_url });
	}

	async #updateProfile(profile: ProfileUpdate) {
		const { error, data } = await this.supabase
			.from('profiles')
			.update(profile)
			.eq('id', this.session.user.id);

		if (error != null) {
			throw httpError(500, 'Error updating profile');
		}

		return data;
	}

	#uploadAvatar(image: Blob) {
		return this.imageService.uploadImage(image, 'avatar');
	}
}
