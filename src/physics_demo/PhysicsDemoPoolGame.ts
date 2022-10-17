import PoolGame from "../PoolGame";
import { 
    playDemoScenario1, 
    playDemoScenario2, 
    playDemoScenario3, 
    playDemoScenario4, 
    playDemoScenario5, 
    playDemoScenario6, 
    playDemoScenario7, 
    playDemoScenario8
} from "./DemoScenarios";

export default class PhysicsDemoPoolGame extends PoolGame {
    private style = `
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        
        li {
            float: left;
            padding: 5px;
        }
    `;

    private demos = [
        playDemoScenario1,
        playDemoScenario2,
        playDemoScenario3,
        playDemoScenario4,
        playDemoScenario5,
        playDemoScenario6,
        playDemoScenario7,
        playDemoScenario8,
    ];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        const styleSheet = document.createElement("style");
        styleSheet.innerText = this.style;
        document.head.appendChild(styleSheet);

        const ul = document.createElement("ul");
        this.canvas.parentNode?.insertBefore(ul, this.canvas);

        for (let i = 0; i < this.demos.length; i++) {
            const li = document.createElement("li");
            ul.appendChild(li);

            const button = document.createElement("button");
            button.onclick = () => this.demos[i](this, this.canvas);
            button.textContent = "Scenario " + (i + 1);
            li.appendChild(button);
        }
    }
};