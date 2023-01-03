import type PoolGame from "./PoolGame";

/**
 * Abstract base class for all game states
 * @class PoolGameState
 */
export default abstract class PoolGameState {
    /**
     * Game's instance
     */
    protected game: PoolGame;

    constructor(game: PoolGame) {
        this.game = game;
    }

    /**
     * Method run on every game update
     * @param dt time since the last update
     */
    onUpdate(dt: number): void {}
    
    /**
     * Method run whenever game enters this state
     */
    abstract onEnterState(): void;
    /**
     * Method run whenever game leaves this state
     */
    abstract onLeaveState(): void;
}

