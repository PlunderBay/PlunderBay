import { PossibleTurnDirections } from "./possibleTurnDirections";

export class ShipState {
    lastProcessedInput: number;
    x: number;
    z: number;
    currentRotation: number;
    currentSpeed: number;

    currentTurnDirectionKey: string;
    possibleTurnDirections: PossibleTurnDirections;

    minSpeed: number;
    maxSpeed: number;
    turnSpeed: number;

    constructor(){
        this.lastProcessedInput = 0
        this.x = 0;
        this.z = 0;
        this.currentRotation = 0;
        this.currentSpeed = 0;

        this.currentTurnDirectionKey = "center";
        this.possibleTurnDirections = new PossibleTurnDirections();

        this.minSpeed = 0.0;
        this.maxSpeed = 10.0;
        this.turnSpeed = 0.01;
    }
}