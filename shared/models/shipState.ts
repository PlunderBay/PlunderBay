import { PossibleTurnDirections } from "./possibleTurnDirections";

export interface ShipState {
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
}