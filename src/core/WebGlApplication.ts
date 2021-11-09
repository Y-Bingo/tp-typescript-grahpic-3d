import { Application } from './application';

export class WebGLApplication extends Application {
	public gl: WebGLRenderingContext | null = null; // 操作 webgl 上下文
	// public matStack: GLWorldMatrixStack; //
	// public builder: GLMeshBuilder; //
	protected canvas2D: HTMLCanvasElement | null = null;
	protected ctx2D: CanvasRenderingContext2D | null = null;

	public constructor(
		canvas: HTMLCanvasElement,
		contextAttributes: WebGLContextAttributes = { premultipliedAlpha: false },
		need2d: boolean = false,
	) {
		super(canvas);
	}
}
