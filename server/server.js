const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on(`connection`, (socket) => {
  console.log("A new  User Just connected");

  socket.emit("newMessage", {
    from: "dubey",
    message: "hello man",
    createdAt: new Date().getTime(),
  });
  socket.broadcast.emit("newMessage", {
    from: "dubey",
    message: "new user joined",
    createdAt: new Date().getTime(),
  });

  socket.on("createMessage", (message) => {
    console.log("create message", message);
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime(),
    });
  });

  socket.on(`disconnect`, () => {
    console.log("disconnected from server");
  });
});

server.listen(port, () => {
  console.log(`server is running at ${port}`);
});
