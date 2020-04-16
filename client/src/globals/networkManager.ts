import * as socketIo from 'socket.io-client';

import { ShipInput } from 'shared/models/shipInput';
import { ClientUpdate } from 'shared/models/clientUpdate';

const serverIp = "localhost:3000";

export class NetworkManager {
    private socket: SocketIOClient.Socket;

    private onPlayerIdSetCalls = new Array<(data: string) => {}>();
    private onWorldStateUpdateCalls = new Array<(data: string) => {}>();

    private NetworkManager() {
        this.socket = socketIo.connect(serverIp);

        this.socket.on('playerIdSet', (data: string) => {
            this.onPlayerIdSetCalls.forEach((element) => { element(data); })
        });
        
        this.socket.on('worldStateUpdate', (data: string) => {
            this.onWorldStateUpdateCalls.forEach((element) => { element(data); })
        });
    }

    public static instance = new NetworkManager();

    public addOnPlayerIdSetCall(call: (data: string) => {}): ()=>void {
        this.onPlayerIdSetCalls.push(call);
        let index = this.onPlayerIdSetCalls.length;
        return ()=>{this.onPlayerIdSetCalls.splice(index);}
    }

    public addOnWorldStateUpdateCall(call: (data: string) => {}) {
        this.onWorldStateUpdateCalls.push(call);
    }

    public emitEvent(eventName: string, data: string) {
        this.socket.emit(eventName, data);
    }

}