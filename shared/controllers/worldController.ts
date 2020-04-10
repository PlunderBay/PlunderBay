import { ShipController } from './shipController';

import { ShipModel } from '../models/shipModel';
import { WorldModel } from '../models/worldModel';
import { AssetContainer } from '@babylonjs/core';

export class WorldController {
    private assets: AssetContainer
    private state: WorldModel;
    private shipControllers: Map<string, ShipController> = new Map();

    constructor(state: WorldModel, playerId: string, assets: AssetContainer) {
        this.assets = assets;
        this.state = state;
        //do something with playerid

        this.state.ships.forEach((value: ShipModel, key: string) => {
            this.shipControllers.set(key, new ShipController(this.assets.instantiateModelsToScene(), value));
        });
        
    }

    public setState(newState: WorldModel): void {
        newState.ships.forEach((value: ShipModel, key: string) => {
            if (this.shipControllers.has(key)) { this.shipControllers[key].setState(value); }
            else { this.shipControllers.set(key, new ShipController(this.assets.instantiateModelsToScene(), value)); }
        });
    }

    public tick(): void {
        this.shipControllers.forEach((value: ShipController, key: string) => {
            value.tick();
        });
    }
}
