import * as BABYLON from "@babylonjs/core";

import { ShipInput } from '../models/shipInput';
import { ShipState } from '../models/shipState';
import { ShipController } from './shipController';

import * as globalState from "../globals/globalState"

export class PlayerShipController extends ShipController {
    private camera: BABYLON.FreeCamera;
    private pendingInputs: Map<number, ShipInput>;

    constructor(assets: BABYLON.InstantiatedEntries, state: ShipState, camera: BABYLON.FreeCamera) {
        super(assets, state);
        this.camera = camera;
    }

    public tick(deltaTime: number): void {
        //calculate and set new turn direction based on globalinputstate
        let direction = globalState.currentPointerScenePostion.subtract(this.shipMesh.position);

        let v1 = new BABYLON.Vector3(0, 0, 1);
        let v2 = direction.normalize();

        // calculate the angle for the new direction
        let angle = Math.acos(BABYLON.Vector3.Dot(v1, v2));
        let currentRotation = this.state.currentRotation;

        if (angle == currentRotation) {
            this.state.currentTurnDirectionKey = "center";
        } else {
            if (Math.abs(currentRotation - angle) < Math.abs((Math.PI * 2) - currentRotation + angle)) {
                this.state.currentTurnDirectionKey = "left";
            } else {
                this.state.currentTurnDirectionKey = "right";
            }
        }

        super.tick(deltaTime);

        //update camera position
        this.camera.position = new BABYLON.Vector3(70 + this.state.x, 70, 70 + this.state.z);

        let currentRequestNr = globalState.getCurrentRequestNumber();
        this.pendingInputs.set(currentRequestNr, this.lastInput);
        globalState.setCurrentPlayerShipJSON(JSON.stringify({ id: globalState.playerId, requestNr: currentRequestNr, ship: this.lastInput }));
    }

    //override setstate for reconcilation
    public setState(state: ShipState): void {
        this.state = state;
        this.pendingInputs.forEach((value, key) => {
            if (key <= globalState.lastProcessedRequestNumber) {
                this.pendingInputs.delete(key);
            } else {
                this.applyInput(value);
            }
        });
        this.applyStateToMesh();
    }


}