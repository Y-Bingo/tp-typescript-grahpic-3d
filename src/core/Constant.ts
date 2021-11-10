/**
 * shader 类型枚举
 */
export enum EShaderType {
	VS_SHADER,
	FS_SHADER,
}

/**
 * 重定义 GLSL ES 数据类型
 */
export enum EGLSLESDataType {
	FLOAT_VEC2 = 0x8b50,
	FLOAT_VEC3,
	FLOAT_VEC4,
	INT_VEC2,
	INT_VEC3,
	INT_VEC4,
	BOOL,
	BOOL_VEC2,
	BOOL_VEC3,
	BOOL_VEC4,
	FLOAT_MAT2,
	FLOAT_MAT3,
	FLOAT_MAT4,
	SAMPLER_2D,
	SAMPLER_CUBE,

	FLOAT = 0x1406,
	INT = 0x1404,
}
