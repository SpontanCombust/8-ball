import type Ball from "../Ball";
import type PoolGame from "../PoolGame";
import PoolGameState from "../PoolGameState";
import PoolGameState_Aiming from "./PoolGameState_Aiming";
import PoolGameContext_BallPlacement from "./PoolGameState_BallPlacement";

export default class PoolGameState_RoundConclusion extends PoolGameState {
    private scoredBalls: Ball[];

    constructor(game: PoolGame, scoredBalls: Ball[]) {
        super(game);

        this.scoredBalls = scoredBalls;
    }

    onEnterState(): void {
        // no ball was scored
        if(this.scoredBalls.length == 0) {
            this.game.switchPlayer();
            this.game.changeState(new PoolGameState_Aiming(this.game));
            return;
        }

        let scoredWhite = false;
        let scoredBlack = false;
        let scoredIncorrectVariant = false;
        let won = false;
        for(let i = 0; i < this.scoredBalls.length; i++) {
            const ball = this.scoredBalls[i];
            
            if(ball.isStripedVariant()) {
                this.game.scoredBallsP2.push(ball);
            } else if(ball.isSolidVariant() && ball.lookVariant != 8) {
                this.game.scoredBallsP1.push(ball);
            }
            
            if(!ball.isSolidVariant() && !ball.isStripedVariant()) {
                scoredWhite = true;
            }
            else if(ball.lookVariant == 8) {
                scoredBlack = true;
                if(i == this.scoredBalls.length - 1 && this.game.ballsOnTable.length <= 1) {
                    won = true;
                }
            }
            else if((this.game.currentPlayer == 1 && ball.isStripedVariant())
                || (this.game.currentPlayer == 2 && ball.isSolidVariant())) {
                scoredIncorrectVariant = true;       
            }
        }

        // TODO some form of announcement text to be displayed in the middle
        // to inform about the result of the round
        if(scoredBlack) {
            const opponent = (this.game.currentPlayer == 1) ? 2 : 1;
            if(won) {
                console.log("Victory for player " + this.game.currentPlayer + "!");
            } else {
                console.log("Victory for player " + opponent + "!");
            }
        } else if(scoredWhite) {
            this.game.ballsOnTable.push(this.game.whiteBall);
            this.game.switchPlayer();
            this.game.changeState(new PoolGameContext_BallPlacement(this.game, false));
        } else if(scoredIncorrectVariant) {
            this.game.switchPlayer();
            this.game.changeState(new PoolGameState_Aiming(this.game));
        } else {
            this.game.changeState(new PoolGameState_Aiming(this.game));
        }
    }

    onLeaveState(): void {
        
    }
}