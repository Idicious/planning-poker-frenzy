import { Tokens } from '$lib/di-tokens';
import type { Database } from '$lib/generated-db-types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';

@injectable()
export class RoomService {
	constructor(
		@inject(Tokens.Supabase) private supabase: SupabaseClient<Database>,
		@inject(Tokens.Session) private session: Session
	) {}

	async getRooms() {
		const { data, error } = await this.supabase
			.from('rooms')
			.select('*')
			.eq('host_id', this.session.user.id);

		if (error) {
			console.error(error);
			throw new Error(error.message);
		}

		return data;
	}
}
