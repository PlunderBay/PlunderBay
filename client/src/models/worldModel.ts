import { ShipModel } from "./shipModel";

export class WorldModel {
    ships: Map<string, ShipModel>;

    public static fromJSON(json: object): WorldModel {
        return { ships: new Map(json["ships"]) as Map<string, ShipModel> };
    }
}