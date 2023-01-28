import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import type { Database } from '../src/lib/generated-db-types';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (supabaseUrl == null || supabaseKey == null) {
	throw new Error('Missing environment variables');
}

const client = createClient<Database>(supabaseUrl, supabaseKey);

async function seed() {
	// Insert default user
	const { error: defaultUserError, data: defaultUser } = await client.auth.admin.createUser({
		email: 'user@localhost.dev',
		password: 'password',
		email_confirm: true
	});

	if (defaultUserError) throw defaultUserError;

	// Update user profile
	const { error: profileError } = await client
		.from('profiles')
		.upsert({ id: defaultUser.user.id, username: 'user', website: 'https://localhost.dev' });

	if (profileError) throw profileError;

	// Insert room
	const { error: roomError } = await client
		.from('rooms')
		.insert({ host_id: defaultUser.user.id, name: 'room' });

	if (roomError) throw roomError;
}

try {
	await seed();
	console.info('SEEDING SUCCESS');
} catch (error) {
	console.error('SEEDING ERROR');
	console.error(error);
}
