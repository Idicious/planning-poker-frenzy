import { Tokens } from '$lib/di-tokens';
import type { Database } from '$lib/generated-db-types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';
import type { CreateRoomDTO } from './schemas';

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

	async createRoom({ name }: CreateRoomDTO) {
		const { data, error } = await this.supabase
			.from('rooms')
			.insert({ name, host_id: this.session.user.id })
			.select('*')
			.single();

		if (error) {
			console.error(error);
			throw new Error(error.message);
		}

		return data;
	}

	async roomExists(name: string) {
		const { error, data } = await this.supabase
			.from('rooms')
			.select('name')
			.eq('name', name)
			.maybeSingle();

		if (error) {
			console.error(error);
			throw new Error(error.message);
		}

		return data != null;
	}
}
