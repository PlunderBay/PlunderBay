import * as BABYLON from '@babylonjs/core';

import { ShipState } from 'shared/models/shipState';
import { WorldState } from 'shared/models/worldState';

import { ShipController } from './shipController';
import { PlayerShipController } from './playerShipController';
import { NetworkManager } from '../globals/networkManager';

export class WorldController {
    private assets: BABYLON.AssetContainer
    private state: WorldState;
    private shipControllers: Map<string, ShipController> = new Map();

    private onShipDisconnected(shipKey: string) {
        if (this.shipControllers.has(shipKey)) {
            this.shipControllers.get(shipKey).dispose();
            this.shipControllers.delete(shipKey);
        }
    }

    constructor(state: WorldState, assets: BABYLON.AssetContainer, camera: BABYLON.FreeCamera) {
        this.assets = assets;
        this.state = state;
        NetworkManager.instance.addOnPlayerIdSetCall((playerId: string) => {
            this.shipControllers = new Map();
            this.state.ships.forEach((value: ShipState, key: string) => {
                if (key != playerId) {
                    this.shipControllers.set(key, new ShipController(this.assets.instantiateModelsToScene(), value));
                } else {
                    this.shipControllers.set(key, new PlayerShipController(this.assets.instantiateModelsToScene(), value, camera, playerId));
                }
            });
        });

        NetworkManager.instance.addOnPlayerDisconnectedCall( (playerId: string) => { this.onShipDisconnected(playerId); });
    }

    public setState(newState: WorldState): void {
        if (this.shipControllers != null) {
            newState.ships.forEach((value: ShipState, key: string) => {
                if (this.shipControllers.has(key)) { this.shipControllers.get(key).setState(value); }
                else { this.shipControllers.set(key, new ShipController(this.assets.instantiateModelsToScene(), value)); }
            });
        }
    }

    public tick(deltaTime: number): void {
        if (this.shipControllers != null) {
            this.shipControllers.forEach((value: ShipController, key: string) => {
                value.tick(deltaTime);
            });
        }
    }
}