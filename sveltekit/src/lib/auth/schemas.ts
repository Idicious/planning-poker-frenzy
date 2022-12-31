import { z } from 'zod';

export const SignInDTOSchema = z.object({
	email: z.string().min(6),
	password: z.string().min(6)
});

export type SignInDTO = z.input<typeof SignInDTOSchema>;

export const SocialDTOSchema = z.object({
	provider: z.enum(['github'])
});

export type SocialDTO = z.input<typeof SocialDTOSchema>;
