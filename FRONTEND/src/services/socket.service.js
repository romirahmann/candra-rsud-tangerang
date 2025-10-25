import { io } from "socket.io-client";
import { baseUrl } from "./api.service";

const token = sessionStorage.getItem("token");

const socket = io(baseUrl, {
  autoConnect: false,
  auth: { token },
  transports: ["websocket"],
});

export const connectSocket = () => {
  console.log("Socket Connected!");
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export const listenToUpdate = (event, callback) => {
  socket.on(event, callback);

  return () => {
    socket.off(event, callback);
  };
};

export const emitJoinRoom = (roomId) => {
  socket.emit("join", { room: roomId });
};

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
});

export default socket;
