import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (supabaseUrl == null || supabaseKey == null) {
	throw new Error('Missing environment variables');
}

const client = createClient(supabaseUrl, supabaseKey);

async function seed() {
	// Insert default user
	const { error: defaultUserError, data: defaultUser } = await client.auth.admin.createUser({
		email: 'user@localhost',
		password: 'password',
		email_confirm: true
	});

	if (defaultUserError) throw defaultUserError;

	// Insert user profile
	const { error: profileError } = await client.from('profiles').insert({ id: defaultUser.user.id });

	if (profileError) throw profileError;
}

try {
	await seed();
	console.info('SEEDING SUCCESS');
} catch (error) {
	console.error('SEEDING ERROR');
	console.error(error);
}
