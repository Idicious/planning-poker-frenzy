import { z } from 'zod';

export const RoomDTOSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'Name required').min(5, 'Must be at least 5 characters')
});

export const CreateRoomDTOSchema = RoomDTOSchema.omit({ id: true });
export type CreateRoomDTO = z.infer<typeof CreateRoomDTOSchema>;
