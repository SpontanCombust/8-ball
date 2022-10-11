import type Ball from "./Ball";

export default class PlayTable {
    public balls: Ball[] = [];

    public update(dt: number) {
        for(let ball of this.balls) {
            ball.update(dt);
        }
    
        for(let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                if(this.balls[i].resolveCollision(this.balls[j])) {
                    this.balls[i].impact(this.balls[j]);
                }
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        for(let ball of this.balls) {
            ball.draw(ctx);
        }
    }
}