import { vec2 } from '../math/vec2';

export enum EInputEventType {
	MOUSEEVENT, // 总类，表示鼠标事件
	MOUSEDOWN, // 鼠标按下事件
	MOUSEUP, // 鼠标弹起事件
	MOUSEMOVE, // 鼠标移动事件
	MOUSEDRAG, // 鼠标拖动事件
	KEYBOARDEVENT, // 总类，表示键盘事件
	KEYUP, // 键按下事件
	KEYDOWN, // 键弹起事件
	KEYPRESS, // 按键事件
}

export class CanvasInputEvent {
	public altKey: boolean;
	public ctrlKey: boolean;
	public shiftKey: boolean;

	public type: EInputEventType;

	public constructor(
		altKey: boolean = false,
		ctrlKey: boolean = false,
		shiftKey: boolean = false,
		type: EInputEventType = EInputEventType.MOUSEEVENT,
	) {
		this.altKey = altKey;
		this.ctrlKey = ctrlKey;
		this.shiftKey = shiftKey;
		this.type = type;
	}
}

export class CanvasMouseEvent extends CanvasInputEvent {
	// button 表示当前按下鼠标哪个键
	public button: number; // 0：鼠标左键，1：鼠标中键，2：鼠标右键
	public canvasPosition: vec2;
	public constructor(
		type: EInputEventType,
		canvasPos: vec2,
		button: number,
		altKey: boolean = false,
		ctrlKey: boolean = false,
		shiftKey: boolean = false,
	) {
		super(altKey, ctrlKey, shiftKey, type);
		(this.canvasPosition = canvasPos), (this.button = button);
		console.log('CanvasMouseEvent', this.button);
	}
}

export class CanvasKeyBoardEvent extends CanvasInputEvent {
	public key: string;
	public keyCode: number;
	public repeat: boolean;
	public constructor(
		type: EInputEventType,
		key: string,
		keyCode: number,
		repeat: boolean,
		altKey: boolean = false,
		ctrlKey: boolean = false,
		shiftKey: boolean = false,
	) {
		super(altKey, ctrlKey, shiftKey, type);
		this.key = key;
		this.keyCode = keyCode;
		this.repeat = repeat;
	}
}
