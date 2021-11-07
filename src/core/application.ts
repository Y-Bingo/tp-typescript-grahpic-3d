export class Application {
	public timers: number = -1;
	private _timeId: number = -1;
	private _fps: number = 0;
	public isFlipYCoord: boolean = false;
	// 我们的 Application主要是 canvas2D 和 WebGL 应用
	// 而canvas2D 和 webGL context 都是从 HTMLCanvasElement 元素获取的
	public canvas: HTMLCanvasElement;
	// 本书中的 Demo 以浏览器为主
	// 我们对于 mouseEvent 事件提供一个开关变量
	// 如果下面的变量设置为 true，则每次鼠标移动都会触发 mousemove 事件
	public isSupportMouseEventMove: boolean;
	// 我们使用下面变量来标记当前鼠标是否按下状态
	// 目的是提供 mouseDrag 事件
	protected _isMouseDown: Boolean;
	// _start 成员变量用于标记当前 Application 是否进入不间断的循环状态
	protected _start: boolean = false;
	// requestAnimationFrame 返回
	protected _requestId: number = -1;
	// 用于计算当前更新与上次更新之间的时间差
	protected _lastTime!: number;
	protected _startTime!: number;
	// 声明每帧回调函数
	public frameCallback: ((app: Application) => void) | null;

	public constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this._isMouseDown = false;
		this.isSupportMouseEventMove = false;
		this.frameCallback = null;
		document.oncontextmenu = () => {}; // 禁止右键菜单
	}

	public start(): void {
		if (this._start === false) {
			this._start = true;
			this._requestId = -1;
			this._lastTime = -1;
			this._startTime = -1;
			this._requestId = requestAnimationFrame((msec: number): void => {
				this.step(msec);
			});
		}
	}

	public isRunning(): boolean {
		return this._start;
	}

	public stop(): void {
		if (this._start) {
			cancelAnimationFrame(this._requestId);
			this._requestId = -1;
			this._lastTime = -1;
			this._startTime = -1;
			this._start = false;
		}
	}

	/**
	 * 不断执行
	 * @param timestamp
	 */
	public step(timestamp: number): void {
		if (this._startTime === -1) this._startTime = timestamp;
		if (this._lastTime === -1) this._lastTime = timestamp;
		let elapseMsec = timestamp - this._startTime;
		let intervalSec = timestamp - this._lastTime;
		if (intervalSec !== 0) {
			this._fps = 1000.0 / intervalSec;
		}
		intervalSec /= 1000.0;
		this._lastTime = timestamp;
		// 计时处理
		// this._handleTimers(intervalSec);
		// 先更新
		this.update(elapseMsec, intervalSec);
		// 后渲染
		this.render();
		if (this.frameCallback !== null) {
			this.frameCallback(this);
		}

		requestAnimationFrame((msec: number) => {
			this.step(msec);
		});
	}

	/**
	 * 虚方法，子类需要覆写，用于更新
	 * @param elapseMsec 开始距离的时间
	 * @param intervalSec 距离上一帧的时间
	 */
	public update(elapseMsec: number, intervalSec: number): void {}

	/**
	 * 虚方法，之子类覆写，用于渲染
	 */
	public render(): void {}
}
