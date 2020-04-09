import * as BABYLON from "@babylonjs/core";

import { ShipModel } from '../models/shipModel';

export class ShipController {
    private shipMesh: BABYLON.TransformNode;
    private state: ShipModel;

    constructor(assets: BABYLON.InstantiatedEntries, state: ShipModel) {
        this.shipMesh = assets.rootNodes[0];
        this.state = state;
        this.applyStateToMesh();
    }

    private applyStateToMesh() {
        this.shipMesh.position.x = this.state.x;
        this.shipMesh.position.z = this.state.z;
        this.shipMesh.rotation.y = this.state.currentRotation;
    }

    //This function predicts the new state by continuing to turn and move in the current direction.
    public tick(): void { 
        // The max radial rotation value. This is equals to 360 degrees.
        const maxRadial: number = Math.PI * 2; 
        const directionMultiplier: number = this.state.possibleTurnDirections[this.state.currentTurnDirectionKey];

        //Rotate the ship based on the ships turnspeed and turn direction.
        this.state.currentRotation += this.state.turnSpeed * directionMultiplier; 

        //The ships rotation has to be between 0 and the max radial value
        if (this.state.currentRotation > Math.PI * 2) { this.state.currentRotation -= maxRadial } 
        if (this.state.currentRotation < 0) { this.state.currentRotation += maxRadial }

        //Math to move the ship in the right direction with its current speed.
        this.state.x += this.state.currentSpeed * Math.sin(this.state.currentRotation); 
        this.state.z += this.state.currentSpeed * Math.cos(this.state.currentRotation);

        this.applyStateToMesh();
    }

    public setState(state: ShipModel): void { this.state = state; }


}
