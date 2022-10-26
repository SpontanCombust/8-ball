import type PoolGame from "./PoolGame";

export default abstract class PoolGameState {
    protected game: PoolGame;

    constructor(game: PoolGame) {
        this.game = game;
    }

    onUpdate(dt: number): void {}
    
    abstract onEnterState(): void;
    abstract onLeaveState(): void;
}

