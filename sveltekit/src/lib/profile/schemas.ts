import { removeEmptyFile } from '$lib/forms/validation';
import { z } from 'zod';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

export const ProfileDTOSchema = z
	.object({
		username: z
			.string({ required_error: 'Username is required' })
			.min(USERNAME_MIN_LENGTH, { message: 'Must be at least 3 characters' })
			.max(USERNAME_MAX_LENGTH, { message: 'Must be at most 20 characters' })
			.describe('Username'),
		website: z.string().trim().url('Must be a valid url').or(z.literal('')).describe('Website'),
		avatar: z.instanceof(Blob).transform(removeEmptyFile).optional().describe('Avatar')
	})
	.describe('Profile DTO');

export type ProfileDTO = z.input<typeof ProfileDTOSchema>;
