import PoolGame from "../PoolGame";
import { clamp } from "../Utils";
import Vec2 from "../Vec2";
import PoolGameState from "../PoolGameState";
import PoolGameState_Aiming from "./PoolGameState_Aiming";

export default class PoolGameContext_BallPlacement extends PoolGameState {
    canPlaceAnywhere: boolean;

    constructor(game: PoolGame, startingRound: boolean) {
        super(game);

        this.canPlaceAnywhere = !startingRound;
    }

    private handleMouseMove = (ev: MouseEvent) => {
        if(this.game.whiteBall != null) {
            let newPos = new Vec2(ev.offsetX, ev.offsetY);

            if(!this.canPlaceAnywhere) {
                newPos.x = clamp(
                    newPos.x, 
                    PoolGame.PLAYABLE_AREA[0] + PoolGame.BALL_RADIUS, 
                    PoolGame.PLAYABLE_AREA[0] + PoolGame.PLAYABLE_AREA[2] / 4 - PoolGame.BALL_RADIUS);
                newPos.y = clamp(
                    newPos.y, 
                    PoolGame.PLAYABLE_AREA[1] + PoolGame.BALL_RADIUS, 
                    PoolGame.PLAYABLE_AREA[1] + PoolGame.PLAYABLE_AREA[3] - PoolGame.BALL_RADIUS);
            }

            this.game.whiteBall.position = newPos;
        }
    };  
    
    private handleMouseClick = (ev: MouseEvent) => {
        if(ev.button == 0) {
            this.game.changeState(new PoolGameState_Aiming(this.game));
        }
    };

    onEnterState(): void {
        this.game.cue.enabled = false;
        this.game.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.game.canvas.addEventListener("click", this.handleMouseClick);
    }

    onLeaveState(): void {
        this.game.canvas.removeEventListener("mousemove", this.handleMouseMove);
        this.game.canvas.removeEventListener("click", this.handleMouseClick);
    }
}