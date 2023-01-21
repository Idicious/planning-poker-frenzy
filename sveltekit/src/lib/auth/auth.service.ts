import { Tokens } from '$lib/di-tokens';
import type { Database } from '$lib/generated-db-types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';
import type { SignInDTO, SocialDTO } from './schemas';

@injectable()
export class AuthService {
	constructor(@inject(Tokens.Supabase) private readonly supabase: SupabaseClient<Database>) {}

	public async signInWithPassword({ email, password }: SignInDTO) {
		return this.supabase.auth.signInWithPassword({ email, password });
	}

	public async signInWithOAuth({ provider }: SocialDTO, options: { redirectTo: string }) {
		return this.supabase.auth.signInWithOAuth({ provider, options });
	}

	public async signOut() {
		return this.supabase.auth.signOut();
	}
}
