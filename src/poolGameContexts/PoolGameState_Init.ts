import PoolGameState from "../PoolGameState";
import PoolGameContext_BallPlacement from "./PoolGameState_BallPlacement";

export default class PoolGameContext_Init extends PoolGameState {
    onEnterState(): void {
        this.game.changeState(new PoolGameContext_BallPlacement(this.game, true));   
    }

    onLeaveState(): void {
        
    }
}