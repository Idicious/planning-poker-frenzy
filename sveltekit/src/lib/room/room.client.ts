import type { CreateRoomDTO } from './schemas';

export async function validateName({ name }: CreateRoomDTO) {
	if (!name) return;

	const nameAvailable = await fetch(`/api/room/availability?name=${name}`)
		.then<boolean>((res) => res.json())
		.catch(() => false);

	if (!nameAvailable) {
		return {
			name: ['Name is already taken']
		};
	}
}
