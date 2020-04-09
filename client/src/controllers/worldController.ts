import { ShipController } from './shipController';

import { ShipModel } from '../models/shipModel';
import { WorldModel } from '../models/worldModel';
import { AssetContainer } from '@babylonjs/core';

export class WorldController {
    private assets: AssetContainer
    private state: WorldModel;
    private shipControllers: Record<string, ShipController>;

    constructor(state: WorldModel, playerId: string, assets: AssetContainer) {
        this.assets = assets;
        this.state = state;
        //do something with playerid
        for (let key in this.state.ships) {
            this.shipControllers[key] = new ShipController(this.assets.instantiateModelsToScene(), this.state.ships[key]);
        }
    }

    public setState(newState: WorldModel): void {
        for (let key in newState.ships) {
            if (this.shipControllers[key] != null) { this.shipControllers[key].setState(newState.ships[key]); }
            else { this.shipControllers[key] = new ShipController(this.assets.instantiateModelsToScene(), newState.ships[key]); }
        }
    }

    public tick(): void {
        for(let key in this.shipControllers){
            this.shipControllers[key].tick();
        }
    }
}