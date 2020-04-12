import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

import { WorldState } from "../../shared/models/worldState";
import { ShipState } from "../../shared/models/shipState";
import { ShipInput } from "../../shared/models/shipInput";
import { PossibleTurnDirections } from "../../shared/models/possibleTurnDirections";
import { InputUpdate } from "../../shared/models/inputupdate";

const app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);

//#region User config
app.set("port", process.env.PORT || 3000);
var ticks:number = 50; //Ticks per second
//#endregion
//#region config
var msPerTick:number = 1000 / ticks;
var tickNr:number = 1;
//#endregion
//#region Classes
class GameRoom extends WorldState {
  name:string = "game1"
  idToSocket: Map<string,any> = new Map<string,any>();
  playerInputs: Map<string,Array<InputUpdate>> = new Map<string,Array<InputUpdate>>();


  constructor(){
    super(new Map<string, ShipState>());
  }

  addPlayer(playerID:string, socket:any){
    this.idToSocket.set(playerID, socket);
    this.ships.set(playerID, new ShipState());
    //Empty player inputs.
    this.playerInputs.set(playerID,Array<InputUpdate>())
  }
  removePlayer(playerID:string){
    this.ships.delete(playerID);
  }
  spawnShip(playerID:string){
    var playerShip = this.ships.get(playerID);
  }

}
//#endregion
//#region functions
function genid(length?:number) {
  if (typeof length === 'undefined') {length = 32}

  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
//#endregion

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./index.html"));
});

var gameroom:GameRoom = new GameRoom();

io.on("connection", function (socket: any) {
  //#region On connect...

  //Generate userId, add player to our gameroom, inform player if its ID.
  var playerId = genid()
  gameroom.addPlayer(playerId, socket)
  socket.join(gameroom.name);
  socket.emit('playerIdSet',playerId);

  // Informing parties of new player
  socket.to(gameroom.name).emit('social', "A player joined the server");
  console.log("a user connected");
  

  //#endregion
  socket.on("message", function (message: any) {
    // Player reports it state
    if (message[0] == "state"){
      var inputUpdate:InputUpdate = new InputUpdate();
      inputUpdate.fromJSON(message[1]);

    // Todo validate moves made.
      gameroom.ships.get(playerId).x += inputUpdate.input.xMovement
      gameroom.ships.get(playerId).z += inputUpdate.input.zMovement
      gameroom.ships.get(playerId).currentRotation += inputUpdate.input.rotationMovement
    }
  });
  socket.once('disconnect', () => {
    //NOTE!: The user only seems to disconnect if it has sent atleast 1 message since inittial connect
    console.log("a user disconnected");
    gameroom.ships.delete(playerId);
    gameroom.idToSocket.delete(playerId);
  });
});


//Update loop
setInterval(function(){
  // Lets make all ships JSON ready!
  var jsonShips = gameroom.toJSON();
  // Inform all players in the game room of all players
  io.to(gameroom.name).emit('event', jsonShips);
  tickNr ++;
},msPerTick)

const server = http.listen(3000, function () {
  console.log("listening on *:3000");
});