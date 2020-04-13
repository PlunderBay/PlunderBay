import * as BABYLON from "@babylonjs/core";

import { ShipInput } from 'shared/models/shipInput';
import { ShipState } from 'shared/models/shipState';
import { ClientUpdate } from 'shared/models/clientUpdate';
import { ShipController } from './shipController';

import * as globalState from "../globals/globalState"

export class PlayerShipController extends ShipController {
    private camera: BABYLON.FreeCamera;
    private pendingInputs: Map<number, ShipInput> = new Map();

    constructor(assets: BABYLON.InstantiatedEntries, state: ShipState, camera: BABYLON.FreeCamera) {
        super(assets, state);
        this.camera = camera;
    }

    public tick(deltaTime: number): void {
        if (globalState.currentPointerScenePostion != null) {
            //calculate and set new turn direction based on globalinputstate
            let direction = globalState.currentPointerScenePostion.subtract(this.shipMesh.position);

            let newAngle = Math.atan2(-direction.x, -direction.z);
            newAngle += Math.PI;
            let currentRotation = this.state.currentRotation;
            
            if (Math.abs(newAngle - currentRotation) < this.state.turnSpeed) {
                this.state.currentTurnDirectionKey = "center";
                this.state.currentRotation = newAngle;
            } else {
                let diff = newAngle - currentRotation;
                if (diff < 0) { diff += (Math.PI * 2) }
                if (diff > Math.PI) { this.state.currentTurnDirectionKey = "left"; }
                else { this.state.currentTurnDirectionKey = "right"; }
            }
        }

        super.tick(deltaTime);

        //update camera position
        this.camera.position = new BABYLON.Vector3(70 + this.state.x, 70, 70 + this.state.z);

        let currentRequestNr = globalState.getCurrentRequestNumber();
        this.pendingInputs.set(currentRequestNr, this.lastInput);
        let update: ClientUpdate = { id: globalState.playerId, requestNr: currentRequestNr, input: this.lastInput };
        globalState.setCurrentPlayerShipJSON(JSON.stringify(update));
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