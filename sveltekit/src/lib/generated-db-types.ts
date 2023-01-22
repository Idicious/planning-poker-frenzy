export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			polls: {
				Row: {
					created_at: string | null;
					description: string | null;
					id: string;
					room_id: string | null;
					votes_visible: boolean;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					room_id?: string | null;
					votes_visible?: boolean;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					room_id?: string | null;
					votes_visible?: boolean;
				};
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					full_name: string | null;
					id: string;
					updated_at: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					full_name?: string | null;
					id?: string;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					full_name?: string | null;
					id?: string;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
			};
			rooms: {
				Row: {
					created_at: string | null;
					host_id: string;
					id: string;
					name: string;
				};
				Insert: {
					created_at?: string | null;
					host_id: string;
					id?: string;
					name?: string;
				};
				Update: {
					created_at?: string | null;
					host_id?: string;
					id?: string;
					name?: string;
				};
			};
			votes: {
				Row: {
					created_at: string | null;
					id: string;
					poll_id: string;
					user_id: string;
					vote: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					poll_id: string;
					user_id: string;
					vote?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					poll_id?: string;
					user_id?: string;
					vote?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
