import { CanvasKeyBoardEvent } from './base/CanvasInputEvent';
import { Camera } from './Carmera';
import { WebGLApplication } from './WebGlApplication';

export class CameraApplication extends WebGLApplication {
	public camera: Camera;
	public constructor(
		canvas: HTMLCanvasElement,
		contextAttributes: WebGLContextAttributes = { premultipliedAlpha: false },
		need2d: boolean = false,
	) {
		super(canvas, contextAttributes, need2d);
		this.camera = new Camera(canvas.width, canvas.height, 45, 1, 2000);
	}

	public update(elapsedMsec: number, intervalSec: number): void {
		// 调用 Camera 对象的update ，这样就就能实时计算 camera 的投影和视图的矩阵
		// 这样才能保证摄像机正确运行
		// 如果 CameraApplication 的子类覆写本函数
		// 那么必须在函数的代码调用加上 super
		this.camera.update(intervalSec);
	}

	public onKeyPress(evt: CanvasKeyBoardEvent): void {
		if (evt.key === 'w') {
			this.camera.moveForward(-1); // 摄像机向前运行
		} else if (evt.key === 's') {
			this.camera.moveForward(1); // 摄像机向后运行
		} else if (evt.key === 'a') {
			this.camera.moveRightward(1); // 摄像机向右运行
		} else if (evt.key === 'd') {
			this.camera.moveRightward(-1); // 摄像机向左运行
		} else if (evt.key === 'z') {
			this.camera.moveUpward(1); // 摄像机向上运行
		} else if (evt.key === 'x') {
			this.camera.moveUpward(-1); // 摄像机向下运行
		} else if (evt.key === 'y') {
			this.camera.yaw(1); // 摄像机饶 y 轴旋转
		} else if (evt.key === 'r') {
			this.camera.roll(1); // 摄像机饶 z 轴旋转
		} else if (evt.key === 'p') {
			this.camera.pitch(1); // 摄像机饶 x 轴旋转
		}
	}
}
