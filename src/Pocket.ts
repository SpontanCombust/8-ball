import type Ball from "./Ball";
import Vec2 from "./Vec2";

export default class Pocket {
    private static CAPTURE_DIAMETER_TRESHOLD = 0.7;

    public readonly position: Vec2;
    public readonly radius: number;

    constructor(position: Vec2, radius: number) {
        this.position = position;
        this.radius = radius;
    }

    public isBallCaptured(ball: Ball): boolean {
        const dist = Vec2.diff(ball.position, this.position).len();
        
        if(dist < this.radius) {
            return this.radius + ball.radius - dist < 2 * this.radius * Pocket.CAPTURE_DIAMETER_TRESHOLD;
        }

        return false;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}