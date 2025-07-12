export function readImageFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result as string); // base64 image url
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
