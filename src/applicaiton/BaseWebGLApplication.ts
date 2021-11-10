import { Application } from '../core/application';
import { EShaderType } from '../core/Constant';
import { GLHelper } from '../core/helper/GLHelper';

export class BasicWebGLApplication extends Application {
	public gl: WebGLRenderingContext;

	// public colorShader_vs: string = `
	//     // 1. attribute 顶点属性声明
	//     attribute vec3 aPosition;
	//     attribute vec4 aColor;
	//     // 2. uniform 变量声明
	//     uniform mat4 uMVPMatrix;
	//     // 3. varying 变量声明
	//     varying vec4 vColor;
	//     // 4. 顶点处理入口 main 函数
	//     void main(void){
	//         // 5. gl_Position 为 Vertex Shader 内置 varying 变量，varying 变量会被传递到 Fragment Shader 中
	//         gl_Position = uMVPMatrix * vec4(aPosition, 1.0); // 6. 将坐标值从局部坐标系变换到裁剪坐标系
	//         vColor = aColor;  // 7. 将颜色属性传递到 Fragment Shader 中
	//     }
	// `;

	// public colorShader_fs: string = `
	//     #ifdef GL_ES
	//         precision highp float;
	//     #endif
	//     // 1. 声明 varying 类型的变量 vColor， 该变量对的数据类型和名称必须要和 VertexShader 中数据类型和名称一致
	//     varying vec4 vColor;
	//     // 2. 同样需要一个 main 函数作为入口函数
	//     void main(void){
	//         // 3. 内置了特殊变量： gl_FragColor, 其数据类型为 false
	//         // 4. 直接将 vColor 写入 gl_FragColor 变量中
	//         gl_FragColor = vColor;
	//     }
	// `;

	public colorShader_vs: string = `
        // 1. attribute 顶点属性声明
        attribute mediump vec3 aPosition;
        attribute mediump vec4 aColor;
        // 2. uniform 变量声明
        uniform mediump mat4 uMVPMatrix;
        // 3. varying 变量声明
        varying lowp vec4 vColor;
        // 4. 顶点处理入口 main 函数
        void main(void){
            // 5. gl_Position 为 Vertex Shader 内置 varying 变量，varying 变量会被传递到 Fragment Shader 中
            gl_Position = uMVPMatrix * vec4(aPosition, 1.0); // 6. 将坐标值从局部坐标系变换到裁剪坐标系
            vColor = aColor;  // 7. 将颜色属性传递到 Fragment Shader 中
        }
    `;

	public colorShader_fs: string = `
        // 1. 声明 varying 类型的变量 vColor， 该变量对的数据类型和名称必须要和 VertexShader 中数据类型和名称一致
        varying lowp vec4 vColor;
        // 2. 同样需要一个 main 函数作为入口函数
        void main(void){
            // 3. 内置了特殊变量： gl_FragColor, 其数据类型为 false
            // 4. 直接将 vColor 写入 gl_FragColor 变量中
            gl_FragColor = vColor;
        }
    `;

	public vsShader: WebGLShader;
	public fsShader: WebGLShader;
	public program: WebGLProgram;

	public constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		let contextAttribs: WebGLContextAttributes = {
			depth: true, // 创建深度缓冲区，default 为 true
			stencil: true, // 创建模版缓冲区，default 为 false ， 我们这里设置为 true
			alpha: true, // 颜色缓冲区的格式为 rgba 如果设置为 false， 则颜色缓冲区使用 rgb 格式，default 为 true
			premultipliedAlpha: true, // 不使用预乘 alpha，default 为 true，预乘 alpha 超出本书范围，暂时使用默认
			antialias: true, // 设置抗锯齿为 true， 如果硬件支持，会使用抗锯齿功能 default 为 true
			preserveDrawingBuffer: false, // 帧缓冲区，true 会保留上一帧的渲染，default 为 false
		};
		let ctx: WebGLRenderingContext | null = this.canvas.getContext('webgl', contextAttribs);
		if (ctx === null) {
			throw new Error('无法创建 webglRenderContext 上下文对象');
		}
		this.gl = ctx;

		// // 模拟触发上下丢失
		// canvas.addEventListener('webglcontextlost', e => {
		// 	console.log('webgl context lose: ', JSON.stringify(e));
		// });
		// GLHelper.triggerContextLostEvent(this.gl);

		this.vsShader = GLHelper.createShader(this.gl, EShaderType.VS_SHADER);
		this.fsShader = GLHelper.createShader(this.gl, EShaderType.FS_SHADER);

		GLHelper.compileShader(this.gl, this.colorShader_vs, this.vsShader);
		GLHelper.compileShader(this.gl, this.colorShader_fs, this.fsShader);

		this.program = GLHelper.creatProgram(this.gl);
		GLHelper.linkProgram(this.gl, this.program, this.vsShader, this.fsShader);
	}

	public run(): void {
		GLHelper.printStates(this.gl);
	}
}
