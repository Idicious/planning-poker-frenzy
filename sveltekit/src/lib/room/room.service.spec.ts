import { Tokens } from '$lib/di-tokens';
import type { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';
import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended';
import { RoomService } from './room.service';

interface TestContext {
	service: RoomService;
	prisma: DeepMockProxy<PrismaClient>;
}

describe('Room service', () => {
	beforeEach<TestContext>((ctx) => {
		const container = new Container();
		const prisma = mockDeep<PrismaClient>();

		container.bind(RoomService).toSelf().inRequestScope();
		container.bind(Tokens.PrismaClient).toConstantValue(prisma);
		container.bind(Tokens.Session).toConstantValue({
			user: { id: '1' }
		});

		ctx.service = container.get(RoomService);
		ctx.prisma = prisma;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it<TestContext>('should get rooms', async (ctx) => {
		ctx.prisma.room.findMany.mockResolvedValue([{ id: '1' }]);
		const rooms = await ctx.service.getRooms();

		expect(rooms).toEqual([{ id: '1' }]);
		expect(ctx.prisma.room.findMany).toBeCalledTimes(1);
	});
});
