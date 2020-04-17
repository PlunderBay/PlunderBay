import { ShipInput } from './shipInput'

export interface ClientUpdate{
    id:string;
    requestNr: number;
    input: ShipInput;
}