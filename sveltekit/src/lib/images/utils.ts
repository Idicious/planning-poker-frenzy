export function resizeImage(imageUrl: string | null | undefined, width: number, height: number) {
	if (imageUrl == null) return undefined;
	return `${imageUrl}?tr=w-${width},h-${height}`;
}
