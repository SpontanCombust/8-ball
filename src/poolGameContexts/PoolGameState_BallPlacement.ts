import PoolGame from "../PoolGame";
import { clamp } from "../Utils";
import Vec2 from "../Vec2";
import PoolGameState from "../PoolGameState";
import PoolGameState_Aiming from "./PoolGameState_Aiming";

/**
 * Class for game's state when the player is placing the ball
 * @class PoolGameContext_BallPlacement
 */
export default class PoolGameContext_BallPlacement extends PoolGameState {
    /**
     * Denotes whether the ball should be constrained to a specified table region
     */
    canPlaceAnywhere: boolean;

    constructor(game: PoolGame, startingRound: boolean) {
        super(game);

        this.canPlaceAnywhere = !startingRound;
    }

    /**
     * Method that reacts to player's mouse movement
     * @param ev mouse event
     */
    private handleMouseMove = (ev: MouseEvent) => {
        let newPos = new Vec2(ev.offsetX, ev.offsetY);

        let horizontalBoundry;
        if(this.canPlaceAnywhere) {
            horizontalBoundry = PoolGame.PLAYABLE_AREA[0] + PoolGame.PLAYABLE_AREA[2] - PoolGame.BALL_RADIUS;
        } else {
            horizontalBoundry = PoolGame.PLAYABLE_AREA[0] + PoolGame.PLAYABLE_AREA[2] / 4 - PoolGame.BALL_RADIUS;
        }

        newPos.x = clamp(
            newPos.x, 
            PoolGame.PLAYABLE_AREA[0] + PoolGame.BALL_RADIUS, 
            horizontalBoundry);
        newPos.y = clamp(
            newPos.y, 
            PoolGame.PLAYABLE_AREA[1] + PoolGame.BALL_RADIUS, 
            PoolGame.PLAYABLE_AREA[1] + PoolGame.PLAYABLE_AREA[3] - PoolGame.BALL_RADIUS);

        this.game.whiteBall.position = newPos;
    };  
    
    /**
     * Method that reacts to player's mouse clicks
     * @param ev mouse event
     */
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