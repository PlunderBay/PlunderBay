import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

import * as socketIo from 'socket.io-client';
import { WorldState } from "shared/models/worldState";
import { WorldController } from "./controllers/worldController";
import * as globalState from "./globals/globalState"

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas);
let scene = new BABYLON.Scene(engine);
let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
light.intensity = 0.4;
let material = new BABYLON.StandardMaterial("water", scene);
material.emissiveColor = new BABYLON.Color3(0, 0, 1);

BABYLON.SceneLoader.LoadAssetContainer("../assets/", "ship-PLACEHOLDER-v7 (canon animation test).gltf", scene, (assets) => {

    //let sphere = assets.instantiateModelsToScene();

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(70, 70, 70), scene);
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    var distance = 100;
    var aspect = scene.getEngine().getRenderingCanvasClientRect().height / scene.getEngine().getRenderingCanvasClientRect().width;
    camera.orthoLeft = -distance / 2;
    camera.orthoRight = distance / 2;
    camera.orthoBottom = camera.orthoLeft * aspect;
    camera.orthoTop = camera.orthoRight * aspect;
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));

    var ground = BABYLON.Mesh.CreateGround("ground1", 60, 60, 2, scene);
    ground.material = material;

    let socket = socketIo.connect("localhost:3000");
    let world: WorldController;
    let playerId: string;
    socket.on("playerIdSet", (data: string) => {
        globalState.setPlayerId(data);
    });

    socket.on("worldStateUpdate", (data: string) => {
        let worldModel: WorldState = WorldState.fromJSON(data);
        if (world == null) {
            world = new WorldController(worldModel, assets, camera);
        } else {
            world.setState(worldModel);
        }
    });

    scene.registerBeforeRender(() => {
        if (world != null) {
            //update world
            let deltaTime = engine.getDeltaTime();
            world.tick(deltaTime);
            socket.emit('state', globalState.currentPlayerShipJSON);
        }
    });

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
        canvas.style.width = "100%";
        canvas.style.height = "100%";
    });

    window.addEventListener("mousemove", function (event) {
        globalState.setCurrentPointerScenePostion(scene.pick(scene.pointerX, scene.pointerY).pickedPoint);
    });
});