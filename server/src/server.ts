import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import { WorldState } from "shared/models/worldState";
import { ShipInput } from "shared/models/shipInput";
import { ClientUpdate } from "shared/models/clientUpdate";
import { ShipState } from "shared/models/shipState";

const app = express();

function generateSloop(): ShipState{
  return  {
    lastProcessedInput: 0,
    x: 0,
    z: 0,
    currentRotation: 0,
    currentSpeed: 0.1,
    currentTurnDirectionKey: "center",
  
    possibleTurnDirections: {
      left: -1,
      center: 0,
      right: 1
    },
    
    minSpeed: 0,
    maxSpeed: 0.1,
    turnSpeed: 0.01
  };
}

let lastId = 0;
let world = WorldState.empty();

app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./index.html"));
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket: any) {
  socket.emit('playerIdSet', "" + lastId);
  world.ships.set((lastId + ""), generateSloop());
  lastId++

  socket.on('state', (message: string) => {
    console.log(message);
    let object: ClientUpdate = JSON.parse(message); //make state model
    let updateship = world.ships.get(object.id);
    updateship.lastProcessedInput = object.requestNr;
    
    let input: ShipInput = object.input;
    updateship.x += input.xMovement;
    updateship.z += input.zMovement;
    updateship.currentRotation += input.rotationMovement;
    const maxRadial: number = Math.PI * 2;
    if (updateship.currentRotation > maxRadial) { updateship.currentRotation = 0 }
    if (updateship.currentRotation < 0) { updateship.currentRotation = maxRadial }
    console.log(updateship);
    world.ships.set(object.id, updateship);
  });

});




const server = http.listen(3000, function () {
  console.log("listening on *:3000");
});

setInterval(() => { io.emit("worldStateUpdate", world.toJSON())}, 50);