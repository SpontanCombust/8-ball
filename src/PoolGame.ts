import type Ball from "./Ball";
import Game from "./Game";
import type Line from "./Line";

export default class PoolGame extends Game {
    public balls: Ball[] = [];
    public walls: Line[] = [];

    protected onUpdate(dt: number): void {
        for(let ball of this.balls) {
            ball.update(dt);
        }
    
        for(let i = 0; i < this.balls.length; i++) {
            for (let j = 0; j < this.walls.length; j++) {
                if(this.balls[i].resolveCollision(this.walls[j])) {
                    this.balls[i].impact(this.walls[j]);
                }
            }

            for (let k = i + 1; k < this.balls.length; k++) {
                if(this.balls[i].resolveCollision(this.balls[k])) {
                    this.balls[i].impact(this.balls[k]);
                }
            }
        }
    }

    protected onDraw(): void {
        for(const wall of this.walls) {
            wall.draw(this.ctx);
        }

        for(const ball of this.balls) {
            ball.draw(this.ctx);
        }
    }
}