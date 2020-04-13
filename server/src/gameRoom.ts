import { WorldState } from 'shared/models/worldState'
import { ClientUpdate } from 'shared/models/clientUpdate'
import { ShipState } from 'shared/models/shipState';
import * as shiptypes from './shiptypes';

export class GameRoom {
    private name: string;
    private world: WorldState;
    private idToSocket: Map<string, any>;

    constructor(name: string) {
        this.name = name;
        this.world = WorldState.empty();
        this.idToSocket = new Map();
    }

    getName(): string {
        return this.name;
    }
    removePlayer(playerID: string): void {
        this.world.ships.delete(playerID);
    }

    spawnShip(playerID: string, socket: any): void {
        this.idToSocket.set(playerID, socket);
        let playerShip = shiptypes.getSloop();
        //ToDo: add random spawn location
        this.world.ships.set(playerID, playerShip);
    }

    removeShip(playerId: string): void {
        this.world.ships.delete(playerId);
        this.idToSocket.delete(playerId);
    }

    applyClientUpdate(update: ClientUpdate): void {
        if (this.world.ships.has(update.id)) {
            let ship = this.world.ships.get(update.id);
            ship.lastProcessedInput = update.requestNr;
            //ToDo: validate input
            ship.x += update.input.xMovement;
            ship.z += update.input.zMovement;
            ship.currentRotation += update.input.rotationMovement;
            const maxRadial: number = Math.PI * 2;
            if (ship.currentRotation > maxRadial) { ship.currentRotation = 0 }
            if (ship.currentRotation < 0) { ship.currentRotation = maxRadial }
            this.world.ships.set(update.id, ship);
        }
    }

    getWorldUpdateJSON(): string {
        return this.world.toJSON();
    }

}