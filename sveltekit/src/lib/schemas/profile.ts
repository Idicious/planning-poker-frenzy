import { z } from 'zod';

export const ProfileDTOSchema = z
	.object({
		username: z
			.string({ required_error: 'Username is required' })
			.describe('Username')
			.min(3, { message: 'Must be at least 3 characters' })
			.max(20, { message: 'Must be at most 20 characters' }),
		website: z
			.string({ required_error: 'Website is required' })
			.describe('Website')
			.url({ message: 'Invalid website URL' })
	})
	.describe('Profile DTO');

export type ProfileDTO = z.infer<typeof ProfileDTOSchema>;
