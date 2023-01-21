import { z } from 'zod';

export const SignInDTOSchema = z.object({
	email: z.string().min(1, 'Email required').email('Must be a valid email'),
	password: z.string().min(8, 'Must be at least 8 characters').min(1, 'Password required')
});

export type SignInDTO = z.input<typeof SignInDTOSchema>;

export const SocialDTOSchema = z.object({
	provider: z.enum(['github'])
});

export type SocialDTO = z.input<typeof SocialDTOSchema>;
