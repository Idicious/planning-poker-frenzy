export const Tokens = {
	Supabase: Symbol.for('supabase-client'),
	Session: Symbol.for('session'),
	ImageKitConfig: Symbol.for('imagekit-config'),
	PrismaClient: Symbol.for('prisma-client')
} as const;
