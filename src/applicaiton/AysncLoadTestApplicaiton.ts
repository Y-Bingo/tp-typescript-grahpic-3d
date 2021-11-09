import { Application } from '../core/application';
import { HttpRequest } from '../core/http/HttpRequest';

export class AsyncLoadTextApplication extends Application {
	private _urls: string[] = ['data/textureUV.jpg', 'data/pic1.jpg', 'data/pic0.png'];

	/**
	 * 加载图片队列
	 */
	public async loadImageSequence(): Promise<void> {
		for (let i = 0; i < this._urls.length; i++) {
			let image: HTMLImageElement = await HttpRequest.loadImageAsync(this._urls[i]);
			console.log('loadImageSequence: ', i, image);
		}
	}

	/**
	 * 并行加载所有图像文件
	 */
	public loadImageParallel(): void {
		let _promises: Promise<HTMLImageElement>[] = [];
		for (let i = 0; i < this._urls.length; i++) {
			_promises.push(HttpRequest.loadImageAsync(this._urls[i]));
		}
		Promise.all(_promises).then(images => {
			for (let i = 0; i < images.length; i++) {
				console.log('loadImageSequence: ', i, images[i]);
			}
		});
	}

	public async loadTextFile(): Promise<void> {
		let str: string = await HttpRequest.loadTextFileAsync('data/test.txt');
		console.log(str);
	}

	public async run(): Promise<void> {
		await this.loadImageSequence();
		await this.loadTextFile();
		await this.loadImageParallel();
		console.log('执行 run 调用');
	}
}
