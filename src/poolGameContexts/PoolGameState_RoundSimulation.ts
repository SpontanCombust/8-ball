import type Ball from "../Ball";
import PoolGameState from "../PoolGameState";
import PoolGameState_RoundConclusion from "./PoolGameState_RoundConclusion";

export default class PoolGameState_RoundSimulation extends PoolGameState {
    private ballsInPockets: Ball[] = [];

    onEnterState(): void {
        this.game.cue.enabled = false;
    }

    onLeaveState(): void {
        
    }


    private updateBallPhysics(dt: number) {
        for(let ball of this.game.ballsOnTable) {
            ball.update(dt);
        }
    }

    private computeCollisions() {
        for(let i = 0; i < this.game.ballsOnTable.length; i++) {
            for (let j = 0; j < this.game.walls.length; j++) {
                if(this.game.ballsOnTable[i].resolveCollision(this.game.walls[j])) {
                    this.game.ballsOnTable[i].impact(this.game.walls[j]);
                }
            }

            for (let k = i + 1; k < this.game.ballsOnTable.length; k++) {
                if(this.game.ballsOnTable[i].resolveCollision(this.game.ballsOnTable[k])) {
                    this.game.ballsOnTable[i].impact(this.game.ballsOnTable[k]);
                }
            }
        }
    }

    private isAnyBallMoving(): boolean {
        for(let ball of this.game.ballsOnTable) {
            if(ball.velocity.len() > 0.01) {
                return true;
            }
        }

        return false;
    }

    private checkPockets() {
        for(let i = 0; i < this.game.pockets.length; i++) {
            for(let j = 0; j < this.game.ballsOnTable.length; j++) {
                if(this.game.pockets[i].isBallCaptured(this.game.ballsOnTable[j])) {
                    this.ballsInPockets.push(this.game.ballsOnTable[j]);
                    this.game.ballsOnTable.splice(j, 1);
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
            this.game.changeState(new PoolGameState_RoundConclusion(this.game, this.ballsInPockets));
        }
    }
}