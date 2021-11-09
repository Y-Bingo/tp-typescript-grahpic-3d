export class HttpRequest {
	public static loadImageAsync(url: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => {
				resolve(image);
			};
			image.onerror = () => {
				reject(new Error(`Could not load image at ${url}`));
			};
			image.src = url;
		});
	}
	public static loadTextFileAsync(url: string): Promise<string> {
		return new Promise((resolve, reject) => {
			let xhr: XMLHttpRequest = new XMLHttpRequest();
			xhr.onreadystatechange = (evt: Event) => {
				if (xhr.readyState === 4 && xhr.status === 200) {
					resolve(xhr.response);
				}
			};
			xhr.open('get', url, true, null, null);
			xhr.send();
		});
	}

	public static loadArrayBufferAsync(url: string): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			let xhr: XMLHttpRequest = new XMLHttpRequest();
			xhr.responseType = 'arraybuffer';
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4 && xhr.status === 200) {
					resolve(xhr.response as ArrayBuffer);
				}
			};
			xhr.open('get', url, true, null, null);
			xhr.send();
		});
	}
}
