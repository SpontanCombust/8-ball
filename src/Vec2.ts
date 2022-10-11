export default class Vec2 {
    public x: number;
    public y: number;

    constructor(x?: number, y?: number) {
        this.x = x ? x : 0.0;
        this.y = y ? y : 0.0;
    }

    public len(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalized(): Vec2 {
        const len = this.len();
        const normX = this.x / len;
        const normY = this.y / len;
        return new Vec2(isNaN(normX) ? 0.0 : normX, isNaN(normY) ? 0.0 : normY);
    }

    public toString(): string {
        return `[${this.x}, ${this.y}]`;
    }


    public static readonly ZERO = new Vec2(0.0, 0.0);
    public static readonly UP = new Vec2(0.0, -1.0);
    public static readonly DOWN = new Vec2(0.0, 1.0);
    public static readonly LEFT = new Vec2(-1.0, 0.0);
    public static readonly RIGHT = new Vec2(1.0, 0.0);

    public static sum(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }

    public static diff(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    }

    public static scaled(v: Vec2, s: number): Vec2 {
        return new Vec2(v.x * s, v.y * s);
    }

    public static dot(v1: Vec2, v2: Vec2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }
}