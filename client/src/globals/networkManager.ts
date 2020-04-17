import * as socketIo from 'socket.io-client';

import { ShipInput } from 'shared/models/shipInput';
import { ClientUpdate } from 'shared/models/clientUpdate';
import { WorldState } from 'shared/models/worldState';

const serverIp = "localhost:3000";

export class NetworkManager {
    private socket: SocketIOClient.Socket;

    private onPlayerIdSetCalls = new Array<(data: string) => {}>();
    private onWorldStateUpdateCalls = new Array<(worldState: WorldState) => {}>();

    private NetworkManager() {
        this.socket = socketIo.connect(serverIp);

        this.socket.on('playerIdSet', (playerId: string) => {
            this.onPlayerIdSetCalls.forEach((element) => { element(playerId); })
        });

        this.socket.on('worldStateUpdate', (data: string) => {
            const worldState: WorldState = JSON.parse(data);
            this.onWorldStateUpdateCalls.forEach((element) => { element(worldState); })
        });
    }

    public static instance = new NetworkManager();

    public addOnPlayerIdSetCall(call: (playerId: string) => {}): () => void {
        this.onPlayerIdSetCalls.push(call);
        return () => { this.onPlayerIdSetCalls.splice(this.onPlayerIdSetCalls.indexOf(call)); };
    }

    public addOnWorldStateUpdateCall(call: (worldState: WorldState) => {}): () => void {
        this.onWorldStateUpdateCalls.push(call);
        return () => { this.onWorldStateUpdateCalls.splice(this.onWorldStateUpdateCalls.indexOf(call)); };
    }

    public emitEvent(eventName: string, data: string) {
        this.socket.emit(eventName, data);
    }

}