import { Tokens } from '$lib/di-tokens';
import { PrismaClient } from '@prisma/client';
import type { Session } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';
import type { CreateRoomDTO } from './schemas';

@injectable()
export class RoomService {
	constructor(
		@inject(Tokens.Session) private session: Session,
		@inject(Tokens.PrismaClient) private prisma: PrismaClient
	) {}

	async getRooms() {
		return this.prisma.room.findMany({
			select: { id: true, name: true, polls: true }
		});
	}

	async getRoom(name: string) {
		return this.prisma.room.findUnique({
			where: { name },
			include: {
				polls: true
			}
		});
	}

	async createRoom({ name }: CreateRoomDTO) {
		return this.prisma.room.create({
			data: {
				name,
				host_id: this.session.user.id
			}
		});
	}

	async roomExists(name: string) {
		const room = await this.prisma.room.findUnique({
			where: { name }
		});

		return room != null;
	}
}
