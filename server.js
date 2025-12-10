const express = require("express");
const app = express();
import v4 from "uuid";
const uuidV4 = v4;
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res, next) => {
  res.render("room", { roomId: req.params.room });
});

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});
server.listen(8080, () => {
  console.log("server is listening on: ", 3000);
});
