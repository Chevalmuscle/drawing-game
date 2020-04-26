module.exports = { playerListUpdate, turnUpdate };

const express = require("express");
const socket = require("socket.io");
const game = require("./game");

const app = express();
const room = 1;

const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
  app.use(express.static("public"));
  console.log(`http://localhost:${port} 🐷`);
});

const io = socket(server);

io.sockets.on("connection", newConnection);

function newConnection(socket) {
  socket.join(room);
  console.log(`new connection: ${socket.id}`);

  game.addPlayer(socket.id, socket.id);

  socket.on("mouse", mouseMsg);
  function mouseMsg(data) {
    socket.broadcast.to(room).emit("mouse", data);
  }
}

function playerListUpdate(playerList) {
  io.in(room).emit("player-list", playerList);
}

function turnUpdate(drawerid, word, timeToGuess) {
  io.in(room).emit("guess-word", { drawerid, word, timeToGuess });
}
