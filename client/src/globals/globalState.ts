import { Vector3 } from "@babylonjs/core";

export let currentPointerScenePostion: Vector3;
export function setCurrentPointerScenePostion(position: Vector3): void { currentPointerScenePostion = position; }