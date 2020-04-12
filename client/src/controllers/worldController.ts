import * as BABYLON from '@babylonjs/core';

import * as globalState from '../globals/globalState'

import { ShipState } from '../models/shipState';
import { WorldState } from '../models/worldState';

import { ShipController } from './shipController';
import { PlayerShipController } from './playerShipController';

export class WorldController {
    private assets: BABYLON.AssetContainer
    private state: WorldState;
    private shipControllers: Map<string, ShipController> = new Map();

    constructor(state: WorldState, assets: BABYLON.AssetContainer, camera: BABYLON.FreeCamera) {
        this.assets = assets;
        this.state = state;

        this.state.ships.forEach((value: ShipState, key: string) => {

            if (key != globalState.playerId) {
                this.shipControllers.set(key, new ShipController(this.assets.instantiateModelsToScene(), value));
                
            } else {

                this.shipControllers.set(key, new PlayerShipController(this.assets.instantiateModelsToScene(), value, camera));
            }
        });
    }

    public setState(newState: WorldState): void { //implement interpolation
        newState.ships.forEach((value: ShipState, key: string) => {
            if (key == globalState.playerId) { globalState.setLastProcessedRequestNumber(value.lastProcessedInput); }
            if (this.shipControllers.has(key)) {this.shipControllers.get(key).setState(value); }
            else { this.shipControllers.set(key, new ShipController(this.assets.instantiateModelsToScene(), value)); }
        });
    }

    public tick(deltaTime: number): void {
        this.shipControllers.forEach((value: ShipController, key: string) => {
            value.tick(deltaTime);
        });
    }
}
