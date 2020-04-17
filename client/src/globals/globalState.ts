import * as BABYLON from "@babylonjs/core";

export let currentPointerScenePostion: BABYLON.Vector3;
export function setCurrentPointerScenePostion(position: BABYLON.Vector3): void { currentPointerScenePostion = position; }