export class ShipState {
    lastProcessedInput: number;
    x: number;
    z: number;
    currentRotation: number;
    currentSpeed: number;
    currentTurnDirectionKey: string;

    possibleTurnDirections: object;
    minSpeed: number;
    maxSpeed: number;
    turnSpeed: number;
}