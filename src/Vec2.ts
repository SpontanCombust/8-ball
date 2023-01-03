/**
 * Class representing mathematical vector with two components
 * @class Vec2
 */
export default class Vec2 {
    public x: number;
    public y: number;

    constructor(x?: number, y?: number) {
        this.x = x ? x : 0.0;
        this.y = y ? y : 0.0;
    }

    /**
     * @returns Lengh of the vector
     */
    public len(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * @returns Copy of this vector, but with negated components
     */
    public negated(): Vec2 {
        return new Vec2(-this.x, -this.y);
    }

    /**
     * @returns Copy of this vector, but with length of 1
     */
    public normalized(): Vec2 {
        const len = this.len();
        const normX = this.x / len;
        const normY = this.y / len;
        return new Vec2(isNaN(normX) ? 0.0 : normX, isNaN(normY) ? 0.0 : normY);
    }

    /**
     * Takes this vector and reflects it from surface, which normal is passed in the parameter
     * @param normal normal of the surface the vector is to be reflected by
     * @returns Copy of this vector reflected by normal
     */
    public reflected(normal: Vec2): Vec2 {
        return Vec2.diff(this, Vec2.scaled(normal.normalized(), 2 * Vec2.dot(normal.normalized(), this)));
    }

    /**
     * @returns String representation of the vector
     */
    public toString(): string {
        return `[${this.x.toFixed(4)}, ${this.y.toFixed(4)}]`;
    }


    public static readonly ZERO = new Vec2(0.0, 0.0);
    public static readonly UP = new Vec2(0.0, -1.0);
    public static readonly DOWN = new Vec2(0.0, 1.0);
    public static readonly LEFT = new Vec2(-1.0, 0.0);
    public static readonly RIGHT = new Vec2(1.0, 0.0);

    /**
     * Makes a sum of two vectors
     * @param v1 1st vector
     * @param v2 2nd vector
     * @returns sum of v1 and v2
     */
    public static sum(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }

    /**
     * Makes a difference between two vectors
     * @param v1 1st vector
     * @param v2 2nd vector
     * @returns v1 minus v2
     */
    public static diff(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    }

    /**
     * Scales input vector by a scalar
     * @param v input vector
     * @param s scaling scalar
     * @returns scaled vector
     */
    public static scaled(v: Vec2, s: number): Vec2 {
        return new Vec2(v.x * s, v.y * s);
    }

    /**
     * Makes a dot product of two vectors
     * @param v1 1st vector
     * @param v2 2nd vector
     * @returns dot product of those vectors
     */
    public static dot(v1: Vec2, v2: Vec2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }
}