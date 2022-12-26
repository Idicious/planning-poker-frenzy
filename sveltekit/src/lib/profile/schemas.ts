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
			.optional()
			.or(z.literal('').transform(() => undefined)),
		avatar: z
			.instanceof(Blob)
			.transform((file) => {
				if (file.size > 0) return file as File;
				return undefined;
			})
			.optional()
			.describe('Avatar')
	})
	.describe('Profile DTO');

export type ProfileDTO = z.input<typeof ProfileDTOSchema>;
