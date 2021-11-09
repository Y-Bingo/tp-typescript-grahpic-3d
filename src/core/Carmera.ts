export class Camera {
	public constructor(w: number, h: number, x: number, y: number, z: number) {}

	/**
	 * 更新方法
	 * @param intervalSec
	 */
	public update(intervalSec: number): void {
		// 调用 Camera 对象的update ，这样就就能实时计算 camera 的投影和视图的矩阵
		// 这样才能保证摄像机正确运行
		// 如果 CameraApplication 的子类覆写本函数
		// 那么必须在函数的代码调用加上 super
	}

	public moveForward(d: number) {}
	public moveRightward(d: number) {}
	public moveUpward(d: number) {}
	public yaw(d: number) {}
	public roll(d: number) {}
	public pitch(d: number) {}
}
