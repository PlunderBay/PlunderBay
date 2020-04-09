import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const app = express();

const testjson = {
  ships: [
    [0, {
      x: 0.1,
      z: 0.2,
      currentRotation: 1.9548,
      currentSpeed: 0.1,
      currentTurnDirectionKey: "left",
      possibleTurnDirections: {
        left: -1,
        center: 0,
        right: 1
      },
      minSpeed: 0.0,
      maxSpeed: 10.0,
      turnSpeed: 0.01
    }],
    [1, {
      x: 10.1,
      z: 10.2,
      currentRotation: 1.9548,
      currentSpeed: 0.1,
      currentTurnDirectionKey: "left",
      possibleTurnDirections: {
        left: -1,
        center: 0,
        right: 1
      },
      minSpeed: 0.0,
      maxSpeed: 10.0,
      turnSpeed: 0.01
    }]
  ]
};

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
  socket.emit('dikEvent', JSON.stringify(testjson));
  console.log("a user connected");
  // whenever we receive a 'message' we log it out
  socket.on("message", function (message: any) {
    console.log(message);
    socket.emit("message", message);
  });
});

const server = http.listen(3000, function () {
  console.log("listening on *:3000");
});