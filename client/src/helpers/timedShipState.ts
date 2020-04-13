import { ShipState } from "shared/models/shipState";

export class TimedShipState {
    private time: number;
    private state: ShipState;

    constructor(state: ShipState) {
        this.state = state;
        this.time = new Date().getTime();
    }

    public getTime(): number {
        return this.time;
    }

    public getState(): ShipState{
        return this.state;
    }
}