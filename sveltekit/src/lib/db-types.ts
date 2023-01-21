import type { Database } from './generated-db-types';

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
