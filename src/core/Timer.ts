// 回调函数别名，回调函数需要第三方实现和设置
export type TimerCallback = (id: number, data: any) => void;
// 纯数据类
export class Timer {
	public id: number = -1;
	public enabled: boolean = false;
	public callback: TimerCallback;
	public callbackData: any = undefined;
	public countdown: number = 0;
	public timeout: number = 0;
	public onlyOnce: boolean = false;
	constructor(callback: TimerCallback) {
		this.callback = callback;
	}
}
