import * as BABYLON from "@babylonjs/core";

import { ShipState } from 'shared/models/shipState';
import { ShipInput } from "shared/models/shipInput";
import { ShipStateBuffer } from "../helpers/shipStateBuffer";

export class ShipController { //implement interpolation
    protected shipMesh: BABYLON.TransformNode;
    protected state: ShipState;
    protected lastInput: ShipInput;

    private interpolation: boolean;
    private interpolationPositionBuffer: ShipStateBuffer;

    constructor(assets: BABYLON.InstantiatedEntries, state: ShipState, interpolation: boolean = true) {
        this.shipMesh = assets.rootNodes[0];
        this.shipMesh.rotationQuaternion = undefined;
        this.state = state;
        this.applyStateToMesh();
        this.interpolation = interpolation;
        if (interpolation) {
            this.interpolationPositionBuffer = new ShipStateBuffer();
            this.interpolationPositionBuffer.addState(this.state);
        }
    }

    protected applyStateToMesh() {
        this.shipMesh.position.x = this.state.x;
        this.shipMesh.position.z = this.state.z;
        this.shipMesh.rotation.y = this.state.currentRotation;
    }

    protected applyInput(input: ShipInput) {
        this.state.x += input.xMovement;
        this.state.z += input.zMovement;
        this.state.currentRotation += input.rotationMovement;

        const maxRadial: number = Math.PI * 2;
        //The ships rotation has to be between 0 and the max radial value
        if (this.state.currentRotation > maxRadial) { this.state.currentRotation = 0 }
        if (this.state.currentRotation < 0) { this.state.currentRotation = maxRadial }
    }

    protected predictMovement(deltaTime: number): void {
        let input = new ShipInput();
        // The max radial rotation value. This is equals to 360 degrees.
        const directionMultiplier: number = this.state.possibleTurnDirections[this.state.currentTurnDirectionKey];

        //Rotate the ship based on the ships turnspeed and turn direction.
        input.rotationMovement = (((this.state.turnSpeed * directionMultiplier) / (1000 / 60)) * deltaTime);

        //Math to move the ship in the right direction with its current speed.
        input.xMovement = (((this.state.currentSpeed * Math.sin(this.state.currentRotation)) / (1000 / 60)) * deltaTime);
        input.zMovement = (((this.state.currentSpeed * Math.cos(this.state.currentRotation)) / (1000 / 60)) * deltaTime);

        this.lastInput = input;
        this.applyInput(input);
        this.applyStateToMesh();
    }

    public tick(deltaTime: number): void {
        if (this.interpolation) {
            this.state = this.interpolationPositionBuffer.getCurrentState();
            this.applyStateToMesh();
        }
        else {
            this.predictMovement(deltaTime);  //This function predicts the new state by continuing to turn and move in the current direction.
        }
    }

    public setState(state: ShipState): void {
        if (this.interpolation) {
            this.interpolationPositionBuffer.addState(state); // Add state to buffer if interpolation is on.
        }
        else {
            this.state = state; // Just accept new state from server if interpolation is off.
        }
    }
}