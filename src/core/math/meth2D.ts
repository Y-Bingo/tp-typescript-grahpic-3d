export const EPSILON: number = 0.00001;
export const PiBy180: number = 0.017453292519943295;

export class Math2D {
	public static toRadian(degree: number): number {
		return degree * PiBy180;
	}

	public static toDegree(radian: number): number {
		return radian / PiBy180;
	}

	public static random(from: number, to: number): number {
		return Math.random() * to + from;
	}

	public static angleSubtract(from: number, to: number): number {
		let diff: number = to - from;
		while (diff > 180) {
			diff -= 360;
		}

		while (diff < -180) {
			diff += 360;
		}

		return diff;
	}

	public static isEquals(left: number, right: number, espilon: number = EPSILON): boolean {
		if (Math.abs(left - right) >= EPSILON) {
			return false;
		}
		return true;
	}
}
