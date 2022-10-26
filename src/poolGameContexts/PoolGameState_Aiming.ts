import PoolGameState from "../PoolGameState";
import PoolGameState_RoundSimulation from "./PoolGameState_RoundSimulation";

export default class PoolGameState_Aiming extends PoolGameState {
    onEnterState(): void {
        this.game.cue.enabled = true;
        this.game.cue.onHit = () => this.game.changeState(new PoolGameState_RoundSimulation(this.game));
    }

    onLeaveState(): void {
        this.game.cue.enabled = false;
        this.game.cue.onHit = () => {};
    }
}