import { ProfileDTOSchema } from './schemas';

describe('Profile Schemas', () => {
	test('avatar is undefined when empty', () => {
		const result = ProfileDTOSchema.parse({
			username: 'username',
			website: 'https://example.com'
		});

		expect(result).toEqual({
			username: 'username',
			website: 'https://example.com'
		});
	});

	test('avatar is undefined when size is 0', () => {
		const result = ProfileDTOSchema.parse({
			username: 'username',
			website: 'https://example.com',
			avatar: new Blob([new ArrayBuffer(0)], { type: 'application/octet-stream' })
		});

		expect(result).toEqual({
			username: 'username',
			website: 'https://example.com'
		});
	});

	test('it keeps extra properties on avatar', () => {
		const result = ProfileDTOSchema.parse({
			username: 'username',
			website: 'https://example.com',
			avatar: new Blob([new ArrayBuffer(1)], { type: 'test' })
		});

		expect(result).toEqual({
			username: 'username',
			website: 'https://example.com',
			avatar: expect.objectContaining({ type: 'test' })
		});
	});
});
