import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import { WorldState } from "./models/worldState";
import { ShipInput } from "./models/shipInput";

const app = express();
const sloop = {
  lastProcessedInput: 0,
  x: 0,
  z: 0,
  currentRotation: 0,
  currentSpeed: 0,
  currentTurnDirectionKey: "center",

  possibleTurnDirections: {
    left: -1,
    center: 0,
    right: 1
  },
  
  minSpeed: 0,
  maxSpeed: 120,
  turnSpeed: 60
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
  world.ships.set((lastId + ""), sloop);
  lastId++

  io.on("state", (data: string) => {
    let object: any = JSON.parse(data);
    console.log(object);
    let updateship = world.ships.get(object["id"]);
    updateship.lastProcessedInput = object["requestNr"];
    
    let input: ShipInput = object["input"];
    updateship.x += input.xMovement;
    updateship.z += input.zMovement;
    updateship.currentRotation += input.rotationMovement;
    console.log(updateship);
    world.ships.set(object["id"], updateship);
  });

});



const server = http.listen(3000, function () {
  console.log("listening on *:3000");
});

setInterval(() => { io.emit("worldStateUpdate", world.toJSON())}, 1000);