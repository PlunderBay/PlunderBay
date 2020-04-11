import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

import * as socketIo from 'socket.io-client';
import { WorldModel } from "./models/worldModel";
import { WorldController } from "./controllers/worldController";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas);
let scene = new BABYLON.Scene(engine);

// scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
// // scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
// // scene.fogDensity = 0.01;
// scene.fogStart = 50.0;
// scene.fogEnd = 165.0;
// scene.fogColor = new BABYLON.Color3(0.93, 0.93, 0.84);


let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
light.intensity = 0.4;
let material = new BABYLON.StandardMaterial("water", scene);
material.emissiveColor = new BABYLON.Color3(0, 0, 1);

//fog shader
let shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./COMMON_NAME",
    {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
});
var mainTexture = new BABYLON.Texture("ground.png", scene);
shaderMaterial.setTexture("textureSampler", mainTexture);


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
    ground.material = shaderMaterial;

    let socket = socketIo.connect("localhost:3000");
    let world: WorldController;
    socket.on("event", (data: string) => {
        let worldModel: WorldModel = WorldModel.fromJSON(JSON.parse(data));
        if (world == null) {
            world = new WorldController(worldModel, "1", assets);
        } else{
            world.setState(worldModel);
        }
    });

    scene.registerBeforeRender(() => {
        if (world != null) {
            //update world
            let deltaTime = engine.getDeltaTime();
            world.tick();
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
});