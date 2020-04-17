import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

import { WorldState } from "shared/models/worldState";
import { WorldController } from "./controllers/worldController";
import * as globalState from "./globals/globalState"
import { NetworkManager } from "./globals/networkManager";

const assetsFolderPath = "../assets/";
const sloopModelFileName = "ship-PLACEHOLDER-v7 (canon animation test).gltf";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas);
let scene = new BABYLON.Scene(engine);
let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
light.intensity = 0.4;
let material = new BABYLON.StandardMaterial("water", scene);
material.emissiveColor = new BABYLON.Color3(0, 0, 1);

BABYLON.SceneLoader.LoadAssetContainer(assetsFolderPath, sloopModelFileName, scene, (assets) => {
    let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(70, 70, 70), scene);
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    let distance = 100;
    let aspect = scene.getEngine().getRenderingCanvasClientRect().height / scene.getEngine().getRenderingCanvasClientRect().width;
    camera.orthoLeft = -distance / 2;
    camera.orthoRight = distance / 2;
    camera.orthoBottom = camera.orthoLeft * aspect;
    camera.orthoTop = camera.orthoRight * aspect;
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));

    let ground = BABYLON.Mesh.CreateGround("ground1", 60, 60, 2, scene);
    ground.material = material;
    let world: WorldController;

    NetworkManager.instance.addOnWorldStateUpdateCall((worldState: WorldState) => {
        if (world == null) {
            world = new WorldController(worldState, assets, camera);
        } else {
            world.setState(worldState);
        }
    });

    scene.registerBeforeRender(() => {
        if (world != null) {
            //update world
            globalState.setCurrentPointerScenePostion(scene.pick(scene.pointerX, scene.pointerY).pickedPoint);
            let deltaTime = engine.getDeltaTime();
            world.tick(deltaTime);
        }
    });

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
        const ratio = window.innerWidth / window.innerHeight;
        const zoom = camera.orthoTop;
        const newWidth = zoom * ratio;
        camera.orthoLeft = -Math.abs(newWidth); camera.orthoRight = newWidth; camera.orthoBottom = -Math.abs(zoom);
    });

});