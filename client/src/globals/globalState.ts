import * as BABYLON from "@babylonjs/core";

export let currentPointerScenePostion: BABYLON.Vector3;
export function setCurrentPointerScenePostion(position: BABYLON.Vector3): void { currentPointerScenePostion = position; }

export let playerId: string;
export function setPlayerId(id: string):void{
    playerId = id;
}

let currentRequestNumber = 0;
export function getCurrentRequestNumber(): number {
    currentRequestNumber++
    return currentRequestNumber - 1;
}

export let lastProcessedRequestNumber = 0;
export function setLastProcessedRequestNumber(reNmbr: number): void {
    lastProcessedRequestNumber = reNmbr;
}

export let currentPlayerShipJSON: string = "";
export function setCurrentPlayerShipJSON(JSON: string): void { currentPlayerShipJSON = JSON; }

