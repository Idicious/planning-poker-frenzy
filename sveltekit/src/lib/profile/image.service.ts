import { Tokens } from '$lib/di-tokens';
import type { Session } from '@supabase/supabase-js';
import { error as httpError } from '@sveltejs/kit';
import ImageKit from 'imagekit';
import { inject, injectable } from 'inversify';
import type { ImageKitConfig } from './imagekit.config';

@injectable()
export class ImageService {
	#imageKit: ImageKit;

	constructor(
		@inject(Tokens.Session) private readonly session: Session,
		@inject(Tokens.ImageKitConfig) private readonly config: ImageKitConfig
	) {
		this.#imageKit = new ImageKit(this.config);
	}

	async uploadImage(image: Blob, fileName: string) {
		try {
			const imageBuffer = Buffer.from(await image.arrayBuffer());

			return await this.#imageKit.upload({
				file: imageBuffer,
				fileName,
				folder: this.session.user.id
			});
		} catch (error) {
			console.log(error);
			throw httpError(500, 'Error uploading avatar');
		}
	}
}
