import { EShaderType } from '../Constant';

export class GLHelper {
	/**
	 * 打渲染状态
	 * @param gl
	 */
	public static printStates(gl: WebGLRenderingContext): void {
		if (gl === null) {
			return;
		}
		// 所有 boolean 状态变量
		console.log(`1. isBlendEnable = ${gl.isEnabled(gl.BLEND)}`);
		console.log(`2. isCullFaceEnable = ${gl.isEnabled(gl.CULL_FACE)}`);
		console.log(`3. isDepthTestEnable = ${gl.isEnabled(gl.DEPTH_TEST)}`);
		console.log(`4. isDitherEnable = ${gl.isEnabled(gl.DITHER)}`);
		console.log(`5. isPolygonOffsetFillEnable = ${gl.isEnabled(gl.POLYGON_OFFSET_FILL)}`);
		console.log(`6. isSampleAlphToCoverageEnable = ${gl.isEnabled(gl.SAMPLE_ALPHA_TO_COVERAGE)}`);
		console.log(`7. isSampleCoverageEnable = ${gl.isEnabled(gl.SAMPLE_COVERAGE)}`);
		console.log(`8. isScissorTestEnable = ${gl.isEnabled(gl.SCISSOR_TEST)}`);
		console.log(`9. isStencilTestEnable = ${gl.isEnabled(gl.STENCIL_TEST)}`);
	}

	/**
	 * 模拟触发webgl 上下文丢失
	 * @param gl
	 */
	public static triggerContextLostEvent(gl: WebGLRenderingContext): void {
		let ret: WEBGL_lose_context | null = gl.getExtension('WEBGL_lose_context');
		if (ret !== null) {
			ret.loseContext();
		}
	}

	/**
	 * 输出 GLSL ES 版本信息
	 * @param gl
	 */
	public static printWebGLInfo(gl: WebGLRenderingContext): void {
		console.log(`render = ${gl.getParameter(gl.RENDERER)}`);
		console.log(`version = ${gl.getParameter(gl.VERSION)}`);
		console.log(`glsl version = ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);
	}

	/**
	 * 创建一个 shader
	 * @param gl
	 * @param type
	 */
	public static createShader(gl: WebGLRenderingContext, type: EShaderType): WebGLShader {
		let shader: WebGLShader | null = null;
		if (type === EShaderType.VS_SHADER) {
			shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		}
		if (shader == null) {
			throw new Error(' WebGL shader 对象创建失败');
		}
		return shader;
	}

	/**
	 * 编译一个 shader
	 * @param gl
	 * @param code
	 * @param shader
	 */
	public static compileShader(gl: WebGLRenderingContext, code: string, shader: WebGLShader): boolean {
		gl.shaderSource(shader, code); // 载入源码
		gl.compileShader(shader); // 编译 shader 源码
		if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
			console.error('shader 编译失败：', gl.getShaderInfoLog(shader));
			// 然后删除 shader ，防止内存泄漏
			gl.deleteShader(shader);
			return false;
		}
		return true;
	}

	/**
	 * 创建 WebGLProgram 对象
	 * @param gl
	 */
	public static creatProgram(gl: WebGLRenderingContext): WebGLProgram {
		let program: WebGLProgram | null = gl.createProgram();
		if (program === null) {
			throw new Error(' WebGLProgram 创建失败');
		}
		return program;
	}

	public static linkProgram(
		gl: WebGLRenderingContext,
		program: WebGLProgram,
		vsShader: WebGLShader,
		fsShader: WebGLShader,
		beforeProgramLink: ((gl: WebGLRenderingContext, program: WebGLProgram) => void) | null = null,
		afterProgramLink: ((gl: WebGLRenderingContext, program: WebGLProgram) => void) | null = null,
	): boolean {
		// 1. 使用 attachShader 方法将顶点和片源着色器与当前的连接器相关联
		gl.attachShader(program, vsShader);
		gl.attachShader(program, fsShader);
		// 2. 在调用 linkProgram 方法前，按需触发 beforeProgramLink 回调函数
		beforeProgramLink && beforeProgramLink(gl, program);
		// 3. 调用 linkProgram 进行链接操作
		gl.linkProgram(program);
		// 4. 使用 gl.LINK_STATUS 参数的 getProgramParameter 方法，进行链接状态检查
		if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
			// 4.1 链接错误 调用 getProgramInfoLog 方法将错误信息以弹窗方式通知调用者
			console.error('链接失败：', gl.getProgramInfoLog(program));
			// 4.2 删除相关资源，防止内存泄漏
			gl.deleteShader(vsShader);
			gl.deleteShader(fsShader);
			gl.deleteProgram(program);
			// 4.3 返回链接状态
			return false;
		}
		// 5. 使用 validateProgram 进行链接验证
		gl.validateProgram(program);
		// 6. 使用带 gl.VALIDATE_STATUS 参数的 getProgramParameter 方法， 进行验证状态检查
		if (gl.getProgramParameter(program, gl.VALIDATE_STATUS) === false) {
			// 6.1 出错提示
			console.error('链接失败：', gl.getProgramInfoLog(program));
			// 6.2 删除相关资源
			gl.deleteShader(vsShader);
			gl.deleteShader(fsShader);
			gl.deleteProgram(program);
			// 6.3 返回链接失败状态
			return false;
		}
		// 7. 全部正确，按需调用 afterProgramLink 回调函数
		afterProgramLink && afterProgramLink(gl, program);
		// 8. 返回链接状态
		return true;
	}
}
