import { ShipState } from "./shipState";

export class WorldState {
    ships: Map<string, ShipState>;

    constructor(ships: Map<string, ShipState>) {
        this.ships = ships;
    }

    public static fromJSON(jsonString: string): WorldState {
        let json = JSON.parse(jsonString);
        return new WorldState(new Map(json["ships"]) as Map<string, ShipState>);
    }

    public toJSON(): string {
        let json = { ships: Array.from(this.ships.entries()) };
        return JSON.stringify(json);
    }
}