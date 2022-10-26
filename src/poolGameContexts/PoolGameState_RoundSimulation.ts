import type Ball from "../Ball";
import PoolGameState from "../PoolGameState";
import PoolGameState_RoundConclusion from "./PoolGameState_RoundConclusion";

export default class PoolGameState_RoundSimulation extends PoolGameState {
    private scoredBalls: Ball[] = [];

    onEnterState(): void {
        this.game.cue.enabled = false;
    }

    onLeaveState(): void {
        
    }


    private updateBallPhysics(dt: number) {
        for(let ball of this.game.balls) {
            ball.update(dt);
        }
    }

    private computeCollisions() {
        for(let i = 0; i < this.game.balls.length; i++) {
            for (let j = 0; j < this.game.walls.length; j++) {
                if(this.game.balls[i].resolveCollision(this.game.walls[j])) {
                    this.game.balls[i].impact(this.game.walls[j]);
                }
            }

            for (let k = i + 1; k < this.game.balls.length; k++) {
                if(this.game.balls[i].resolveCollision(this.game.balls[k])) {
                    this.game.balls[i].impact(this.game.balls[k]);
                }
            }
        }
    }

    private isAnyBallMoving(): boolean {
        for(let ball of this.game.balls) {
            if(ball.velocity.len() > 0.01) {
                return true;
            }
        }

        return false;
    }

    private checkPockets() {
        for(let i = 0; i < this.game.pockets.length; i++) {
            for(let j = 0; j < this.game.balls.length; j++) {
                if(this.game.pockets[i].isBallCaptured(this.game.balls[j])) {
                    this.game.balls.splice(j, 1);
                    break;
                }
            }
        }
    }

    onUpdate(dt: number): void {
        this.updateBallPhysics(dt);
        this.computeCollisions();
        this.checkPockets();

        if(!this.isAnyBallMoving()) {
            //TODO short circuit on white and black balls
            this.game.changeState(new PoolGameState_RoundConclusion(this.game, this.scoredBalls));
        }
    }
}