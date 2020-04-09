export class ShipModel {
    x: number;
    z: number;
    currentRotation: number;
    currentSpeed: number;
    currentTurnDirectionKey: string;

    possibleTurnDirections: Map<string, number>;
    minSpeed: number;
    maxSpeed: number;
    turnSpeed: number;
}