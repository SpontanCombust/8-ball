import PoolGameState from "../PoolGameState";
import PoolGameState_RoundSimulation from "./PoolGameState_RoundSimulation";

/**
 * Class for game's state when the player is aiming the cue
 * @class PoolGameState_Aiming
 */
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