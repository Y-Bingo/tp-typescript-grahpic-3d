import { EPSILON, Math2D } from './meth2D';

export class vec2 {
	public values: Float32Array;

	public constructor(x: number = 0, y: number = 0) {
		this.values = new Float32Array([x, y]);
	}

	public toString(): string {
		return ' [ ' + this.values[0] + ' , ' + this.values[1] + ' ] ';
	}

	public get x(): number {
		return this.values[0];
	}
	public set x(x: number) {
		this.values[0] = x;
	}

	public get y(): number {
		return this.values[1];
	}
	public set y(y: number) {
		this.values[1] = y;
	}

	public reset(x: number = 0, y: number): vec2 {
		this.values[0] = x;
		this.values[1] = y;
		return this;
	}

	public equals(vector: vec2): boolean {
		if (Math.abs(this.values[0] - vector.values[0]) > EPSILON) return false;

		if (Math.abs(this.values[1] - vector.values[1]) > EPSILON) return false;

		return true;
	}

	public negative(): vec2 {
		this.values[0] = -this.values[0];
		this.values[1] = -this.values[1];
		return this;
	}

	public get squaredLength(): number {
		let x = this.values[0];
		let y = this.values[1];
		return x * x + y * y;
	}

	public get length(): number {
		return Math.sqrt(this.squaredLength);
	}

	public normalize(): number {
		let len: number = this.length;
		if (Math2D.isEquals(len, 0)) {
			console.log(' the length = 0 ');
			this.values[0] = 0;
			this.values[1] = 0;
			return 0;
		}

		if (Math2D.isEquals(len, 1)) {
			console.log(' the length = 1 ');
			return 1.0;
		}

		this.values[0] /= len;
		this.values[1] /= len;
		return len;
	}

	public static create(x: number = 0, y: number = 0): vec2 {
		return new vec2(x, y);
	}

	public add(right: vec2): vec2 {
		vec2.sum(this, right, this);
		return this;
	}

	public static sum(left: vec2, right: vec2, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		result.values[0] = left.values[0] + right.values[0];
		result.values[1] = left.values[1] + right.values[1];
		return result;
	}

	public substract(another: vec2): vec2 {
		vec2.difference(this, another, this);
		return this;
	}

	public static difference(end: vec2, start: vec2, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		result.values[0] = end.values[0] - start.values[0];
		result.values[1] = end.values[1] - start.values[1];
		return result;
	}

	public static copy(src: vec2, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		result.values[0] = src.values[0];
		result.values[1] = src.values[1];
		return result;
	}

	public static scale(direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		result.values[0] = direction.values[0] * scalar;
		result.values[1] = direction.values[1] * scalar;
		return result;
	}

	public static scaleAdd(start: vec2, direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		vec2.scale(direction, scalar, result);
		return vec2.sum(start, result, result);
	}

	public static moveTowards(start: vec2, direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		vec2.scale(direction, scalar, result);
		return vec2.sum(start, result, result);
	}

	public innerProduct(right: vec2): number {
		return vec2.dotProduct(this, right);
	}

	public static dotProduct(left: vec2, right: vec2): number {
		return left.values[0] * right.values[0] + left.values[1] * right.values[1];
	}

	public static crossProduct(left: vec2, right: vec2): number {
		return left.x * right.y - left.y * right.x;
	}

	public static getOrientation(from: vec2, to: vec2, isRadian: boolean = false): number {
		let diff: vec2 = vec2.difference(to, from);
		let radian = Math.atan2(diff.y, diff.x);
		if (isRadian === false) {
			radian = Math2D.toDegree(radian);
		}
		return radian;
	}

	public static getAngle(a: vec2, b: vec2, isRadian: boolean = false): number {
		let dot: number = vec2.dotProduct(a, b);
		let radian: number = Math.acos(dot / (a.length * b.length));
		if (isRadian === false) {
			radian = Math2D.toDegree(radian);
		}
		return radian;
	}

	public static cosAngle(a: vec2, b: vec2, norm: boolean = false): number {
		if (norm === true) {
			a.normalize();
			b.normalize();
		}
		return vec2.dotProduct(a, b);
	}

	public static sinAngle(a: vec2, b: vec2, norm: boolean = false): number {
		if (norm === true) {
			a.normalize();
			b.normalize();
		}
		return a.x * b.y - b.x * a.y;
	}

	public static zero = new vec2(0, 0);
	public static xAxis = new vec2(1, 0);
	public static yAxis = new vec2(0, 1);
	public static nXAxis = new vec2(-1, 0);
	public static nYAxis = new vec2(0, -1);
	public static temp = new vec2(0, 0);
	public static temp1 = new vec2(0, 0);
}
