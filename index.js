const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://groupchat-socket-io.vercel.app",
    methods: ["GET", "POST"],
  },
});

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

io.on("connection", (socket) => {
  // console.log(`User connected : ${socket.id}`);

  socket.on("join_room", (data) => {
    const { username, room } = data;
    socket.join(room);
    // console.log(
    //   `User with ID: ${socket.id} (username: ${username}) joined the room: ${room}`
    // );

    // This sends a message to the group chat if a user joins that specific chat.
    socket.to(room).emit("receive_message", {
      author: "System",
      message: `${username} has joined the room`,
      time: new Date().toLocaleTimeString(),
    });

    // This just alert's the user that they joined the group chat
    socket.emit("receive_message", {
      author: "System",
      message: "You joined the group chat",
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("exit_room", (data) => {
    const { username, room } = data;
    socket.leave(room);
    // console.log(
    //   `User with ID: ${socket.id} (username: ${username}) left the room: ${room}`
    // );

    // This just the opposite of the join alert, it just alert's the user when a member of a group chat left.
    socket.to(room).emit("receive_message", {
      author: "System",
      message: `${username} has left the room`,
      time: new Date().toLocaleTimeString(),
    });

    // This just alter's the user that they left the group chat. (Don't need it for now)
    // socket.emit("receive_message", {
    //   author: "System",
    //   message: "You left the group chat",
    //   time: new Date().toLocaleTimeString(),
    // });
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    // console.log(data);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
