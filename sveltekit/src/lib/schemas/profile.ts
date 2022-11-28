import { object, string, type z } from 'zod';

export const ProfileDTOSchema = object({
	username: string({ required_error: 'Username is required' })
		.describe('Username')
		.min(3, { message: 'Must be at least 3 characters' })
		.max(20, { message: 'Must be at most 20 characters' }),
	website: string({ required_error: 'Website is required' })
		.describe('Website')
		.url({ message: 'Invalid website URL' })
}).describe('Profile DTO');

export type ProfileDTO = z.infer<typeof ProfileDTOSchema>;
