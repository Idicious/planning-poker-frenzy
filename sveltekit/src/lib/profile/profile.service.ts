import type { Database } from '$lib/db-types';
import { Tokens } from '$lib/di-tokens';
import { SupabaseClient, type Session } from '@supabase/supabase-js';
import { error as httpError } from '@sveltejs/kit';
import { inject, injectable } from 'inversify';
import { omit } from 'lodash-es';
import { AvatarService } from './avatar.service';
import type { ProfileDTO } from './schemas';

@injectable()
export class ProfileService {
	constructor(
		@inject(Tokens.Session) private readonly session: Session,
		@inject(SupabaseClient) private readonly supabase: SupabaseClient<Database>,
		@inject(AvatarService) private readonly avatarService: AvatarService
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

	async updateProfile(profile: ProfileDTO) {
		const { error } = await this.supabase
			.from('profiles')
			.update(omit(profile, ['avatar']))
			.eq('id', this.session.user.id);

		if (error != null) {
			throw httpError(500, 'Error updating profile');
		}

		if (profile.avatar.size > 0) {
			await this.avatarService.updateAvatar(profile.avatar);
		}
	}
}
