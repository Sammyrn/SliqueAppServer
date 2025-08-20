//socket
const { Server } = require("socket.io");

let io;
const initializeSocket = (server) => {
  const IO = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  },
});

  IO.on("connection", (socket) => {
    const socketID = socket.id
//    console.log(`User connected to socket at ${socketID}`);

    IO.on("disconnect", () => {
      console.log(`User disconnected to socket at ${socketID}`);
    });
  });

  io = IO
  return io;
};

// RETURNS SOCKET SERVER
const getServer = () => (io)

module.exports = {initializeSocket, getServer}