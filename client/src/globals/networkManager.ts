import * as socketIo from 'socket.io-client';

import { ClientUpdate } from 'shared/models/clientUpdate';
import { WorldState } from 'shared/models/worldState';

const serverIp = "localhost:3000";

export class NetworkManager {
    private socket: SocketIOClient.Socket;
    private lastId: string;

    private constructor() {
        this.socket = socketIo.connect(serverIp);
        this.socket.on('playerIdSet', (id: string) => { this.lastId = id; });
    }

    public static instance = new NetworkManager();

    public addOnPlayerIdSetCall(call: (playerId: string) => void): () => void {
        if (this.lastId != null) { call(this.lastId); }
        this.socket.on('playerIdSet', call);
        return () => { this.socket.off('playerIdSet', call); };
    }

    public addOnWorldStateUpdateCall(call: (worldState: WorldState) => void): () => void {
        let handlerFn = (data: string) => { call(WorldState.fromJSON(data)); }
        this.socket.on('worldStateUpdate', handlerFn);
        return () => { this.socket.off('worldStateUpdate', handlerFn); };
    }

    public addOnPlayerDisconnectedCall(call: (playerId: string) => void): () => void {
        this.socket.on('playerDisconnected', call);
        return () => { this.socket.off('worldStateUpdate', call); };
    }

    public emitClientUpdate(update: ClientUpdate) {
        this.socket.emit('clientUpdate', JSON.stringify(update));
    }

}