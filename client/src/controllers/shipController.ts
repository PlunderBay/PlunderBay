import * as BABYLON from "@babylonjs/core";

import { ShipState } from '../models/shipState';
import { ShipInput } from "../models/shipInput";

export class ShipController { //implement interpolation
    protected shipMesh: BABYLON.TransformNode;
    protected state: ShipState;
    protected lastInput: ShipInput;

    constructor(assets: BABYLON.InstantiatedEntries, state: ShipState) {
        this.shipMesh = assets.rootNodes[0];
        this.shipMesh.rotationQuaternion = undefined;
        this.state = state;
        this.applyStateToMesh();
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
        if (this.state.currentRotation > Math.PI * 2) { this.state.currentRotation -= maxRadial }
        if (this.state.currentRotation < 0) { this.state.currentRotation += maxRadial }
    }

    //This function predicts the new state by continuing to turn and move in the current direction.
    public tick(deltaTime: number): void {
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

    public setState(state: ShipState): void { this.state = state; }


}