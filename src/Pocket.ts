import type Ball from "./Ball";
import Vec2 from "./Vec2";

/**
 * Represents pool table pocket in which balls fall down
 * @class Pocket
 */
export default class Pocket {
    /**
     * Coefficient of how big of a part of the ball needs to be inside of the pocket for it to get scored
     */
    private static CAPTURE_DIAMETER_TRESHOLD = 0.7;

    /**
     * Position of the pocket
     */
    public readonly position: Vec2;
    /**
     * Radius of the pocket
     */
    public readonly radius: number;

    constructor(position: Vec2, radius: number) {
        this.position = position;
        this.radius = radius;
    }

    /**
     * Checks if a given ball is inside this pocket and can be scored
     * @param ball tested ball 
     * @returns true if the ball inside the pocket
     */
    public isBallCaptured(ball: Ball): boolean {
        const dist = Vec2.diff(ball.position, this.position).len();
        
        if(dist < this.radius) {
            return this.radius + ball.radius - dist < 2 * this.radius * Pocket.CAPTURE_DIAMETER_TRESHOLD;
        }

        return false;
    }

    /**
     * Draw this pocket
     * @param ctx rendering context
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}