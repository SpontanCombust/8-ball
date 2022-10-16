import type Ball from "./Ball";
import Game from "./Game";

export default class PoolGame extends Game {
    public balls: Ball[] = [];

    protected onUpdate(dt: number): void {
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

    protected onDraw(): void {
        for(const ball of this.balls) {
            ball.draw(this.ctx);
        }
    }
}