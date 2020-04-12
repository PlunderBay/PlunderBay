import { ShipInput } from "./shipInput";

// Update received from player(client) about its input
export class InputUpdate {
    id: string;
    requestNr: number;
    input: ShipInput;


    fromJSON(jsonString: string){
        let object = JSON.parse(jsonString);

        this.id = object.id;
        this.requestNr = object.requestNr;
        this.input = new ShipInput()
        this.input = object.input;
    }
}