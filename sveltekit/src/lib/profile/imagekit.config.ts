import {
	IMAGEKIT_PRIVATE_KEY,
	IMAGEKIT_PUBLIC_KEY,
	IMAGEKIT_URL_ENDPOINT
} from '$env/static/private';

export const imageKitConfig = {
	publicKey: IMAGEKIT_PUBLIC_KEY,
	privateKey: IMAGEKIT_PRIVATE_KEY,
	urlEndpoint: IMAGEKIT_URL_ENDPOINT
} as const;

export type ImageKitConfig = typeof imageKitConfig;
