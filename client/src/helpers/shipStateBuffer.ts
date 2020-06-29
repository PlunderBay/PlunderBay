import { ShipState } from "shared/models/shipState";
import { TimedShipState } from "./timedShipState";

export class ShipStateBuffer {
    private positionList: Array<TimedShipState>;

    constructor() {
        this.positionList = new Array();
    }

    public addState(state: ShipState) {
        this.positionList.push(new TimedShipState(state));
    }

    public getCurrentState(): ShipState {
        const now = new Date().getTime();
        const serverTickTime = (1000 / 20);
        const renderTimeStamp = now - serverTickTime;
        const buffer = this.positionList;

        while (buffer.length > 2 && buffer[0].getTime() <= renderTimeStamp) { //Remove expired states
            buffer.shift();
        }
        
        if (buffer.length >= 2) {
            const oldState = buffer[0].getState();
            const goalState = buffer[1].getState();

            const oldTime = buffer[0].getTime();
            const goalTime = buffer[1].getTime();

            const lerpMultiplier = (renderTimeStamp - oldTime) / (goalTime - oldTime);

            let xInput = (goalState.x - oldState.x) * lerpMultiplier;
            let zInput = (goalState.z - oldState.z) * lerpMultiplier;

            let rotationInput = (goalState.currentRotation - oldState.currentRotation) * lerpMultiplier;
            let newRotation = oldState.currentRotation + rotationInput;

            if (newRotation > Math.PI * 2) { newRotation -= Math.PI * 2; } //Checks so rotation will be valid radial value
            else if (newRotation < 0) { newRotation += Math.PI * 2; }

            return <ShipState>{
                lastProcessedInput: 0,
                x: oldState.x + xInput,
                z: oldState.z + zInput,
                currentRotation: newRotation,
                currentSpeed: 0.1,
                currentTurnDirectionKey: "center",

                possibleTurnDirections: {
                    left: -1,
                    center: 0,
                    right: 1
                },

                minSpeed: 0,
                maxSpeed: 0.1,
                turnSpeed: 0.01
            };
        }

        return buffer[0].getState();
    }


}