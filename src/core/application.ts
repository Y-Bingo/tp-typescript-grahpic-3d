import { CanvasKeyBoardEvent, CanvasMouseEvent, EInputEventType } from './base/CanvasInputEvent';
import { Timer, TimerCallback } from './base/Timer';
import { vec2 } from './math/vec2';

export class Application implements EventListenerObject {
	public timers: Timer[] = [];
	private _timeId: number = -1;
	private _fps: number = 0;
	public isFlipYCoord: boolean = false;
	// 我们的 Application主要是 canvas2D 和 WebGL 应用
	// 而canvas2D 和 webGL context 都是从 HTMLCanvasElement 元素获取的
	public canvas: HTMLCanvasElement;
	// 本书中的 Demo 以浏览器为主
	// 我们对于 mouseEvent 事件提供一个开关变量
	// 如果下面的变量设置为 true，则每次鼠标移动都会触发 mousemove 事件
	public isSupportMouseMove: boolean;
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
		this.isSupportMouseMove = false;
		this.frameCallback = null;
		document.oncontextmenu = () => {}; // 禁止右键菜单
		// 事件绑定
		// canvas 元素能监听鼠标事件
		this.canvas.addEventListener('mousedown', this, false);
		this.canvas.addEventListener('mouseup', this, false);
		this.canvas.addEventListener('mousemove', this, false);
		// 键盘事件只能在全局 window 对象中触发
		window.addEventListener('keydown', this, false);
		window.addEventListener('keyup', this, false);
		window.addEventListener('keypress', this, false);
	}

	public get fps() {
		return this._fps;
	}

	public addTimer(callback: TimerCallback, timeout: number = 1.0, onlyOnce: boolean = false, data: any = undefined): number {
		let timer: Timer;
		let found: boolean = false;
		for (let i = 0; i < this.timers.length; i++) {
			let timer: Timer = this.timers[i];
			if (timer.enabled === false) {
				timer.callback = callback;
				timer.callbackData = data;
				timer.timeout = timeout;
				timer.countdown = timeout;
				timer.enabled = true;
				timer.onlyOnce = onlyOnce;
				return timer.id;
			}
		}
		timer = new Timer(callback);
		timer.callbackData = data;
		timer.timeout = timeout;
		timer.countdown = timeout;
		timer.enabled = true;
		timer.id = ++this._timeId;
		timer.onlyOnce = onlyOnce;
		this.timers.push(timer);
		return timer.id;
	}

	public removeTimer(id: number): boolean {
		let found: boolean = false;
		for (let i = 0; i < this.timers.length; i++) {
			let timer: Timer = this.timers[i];
			timer.enabled = false;
			found = true;
			break;
		}
		return found;
	}

	private _handleTimers(intervalSec: number): void {
		for (let i = 0; i < this.timers.length; i++) {
			let timer: Timer = this.timers[i];
			if (timer.enabled === false) continue;
			timer.countdown -= intervalSec;
			if (timer.countdown < 0.0) {
				timer.callback(timer.id, timer.callbackData);
				if (timer.onlyOnce === false) {
					timer.countdown = timer.timeout;
				} else {
					this.removeTimer(timer.id);
				}
			}
		}
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
		this._handleTimers(intervalSec);
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
	 * 将鼠标事件发生时鼠标指针的位置变换为相对当前 canvas 元素的偏移表示
	 */
	protected viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
		let rect: DOMRect = this.canvas.getBoundingClientRect();
		if (evt.target) {
			let x: number = evt.clientX - rect.left;
			let y: number = 0;
			y = evt.clientX - rect.top;
			if (this.isFlipYCoord) {
				y = this.canvas.height - y;
			}
			let pos: vec2 = new vec2(x, y);
			return pos;
		}
		throw new Error(' evt.target is null ！');
	}

	/**
	 * 将 event 对象信息转换为我们自己定义的 mouseEvent 事件
	 */
	private _isRightMouseDown: boolean = false;
	private _toCanvasMouseEvent(evt: Event, type: EInputEventType): CanvasMouseEvent {
		let event: MouseEvent = evt as MouseEvent;
		if (type === EInputEventType.MOUSEDOWN && event.button === 2) {
			this._isRightMouseDown = true;
		} else if (type === EInputEventType.MOUSEUP && event.button === 2) {
			this._isRightMouseDown = false;
		}
		let buttonNum: number = event.button;
		if (this._isRightMouseDown && type === EInputEventType.MOUSEDRAG) {
			buttonNum = 2;
		}
		let mousePosition: vec2 = this.viewportToCanvasCoordinate(event);
		let canvasMouseEvent: CanvasMouseEvent = new CanvasMouseEvent(type, mousePosition, buttonNum, event.altKey, event.ctrlKey, event.shiftKey);
		return canvasMouseEvent;
	}

	/**
	 * 将 event 对象信息转换为我们自己定义的 keyboard 事件
	 */
	private _toCanvasKeyBoardEvent(evt: Event, type: EInputEventType): CanvasKeyBoardEvent {
		let event: KeyboardEvent = evt as KeyboardEvent;
		let canvasKeyBoardEvent: CanvasKeyBoardEvent = new CanvasKeyBoardEvent(
			type,
			event.key,
			event.keyCode,
			event.repeat,
			event.altKey,
			event.ctrlKey,
			event.shiftKey,
		);
		return canvasKeyBoardEvent;
	}

	public handleEvent(evt: Event): void {
		switch (evt.type) {
			case 'mousedown':
				this._isMouseDown = true;
				this.dispatchMouseDown(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDOWN));
				break;
			case 'mouseup':
				this._isMouseDown = false;
				this.dispatchMouseUp(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEUP));
				break;
			case 'mousemove':
				if (this.isSupportMouseMove) {
					this.dispatchMouseMove(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEMOVE));
				}
				if (this._isMouseDown) {
					this.dispatchMouseDrag(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDRAG));
				}
				break;
			case 'keypress':
				this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYPRESS));
				break;
			case 'keydown':
				this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYDOWN));
				break;
			case 'keyup':
				this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYUP));
				break;
		}
	}

	/**
	 * 虚方法，子类需要覆写
	 * @param evt 事件对象
	 * @returns
	 */
	protected dispatchMouseDown(evt: CanvasMouseEvent): void {
		return;
	}

	/**
	 * 虚方法，子类需要覆写
	 * @param evt 事件对象
	 * @returns
	 */
	protected dispatchMouseUp(evt: CanvasMouseEvent): void {
		return;
	}

	/**
	 * 虚方法，子类需要覆写
	 * @param evt 事件对象
	 * @returns
	 */
	protected dispatchMouseMove(evt: CanvasMouseEvent): void {
		return;
	}

	/**
	 * 虚方法，子类需要覆写
	 * @param evt 事件对象
	 * @returns
	 */
	protected dispatchMouseDrag(evt: CanvasMouseEvent): void {
		return;
	}

	/**
	 * 虚方法，子类需要覆写
	 * @param evt 事件对象
	 * @returns
	 */
	protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
		return;
	}

	/**
	 * 虚方法，子类需要覆写
	 * @param evt 事件对象
	 * @returns
	 */
	protected dispatchKeyUp(evt: CanvasKeyBoardEvent): void {
		return;
	}

	/**
	 * 虚方法，子类需要覆写
	 * @param evt 事件对象
	 * @returns
	 */
	protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {
		return;
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
