import { WebSocketServer } from "ws";
import { WebSocketMethods, Clients, Rooms, } from "./Contants";
import httpServer from "./httpServer";
import { WebSocketController } from "./WebSocketController";

const wsServer = new WebSocketServer({
  server: httpServer
})

const clients: Clients = {}
const rooms: Rooms = {}

wsServer.on("connection", ws => {
  const controller = new WebSocketController(ws, clients, rooms);

  ws.on("message", message => {
    const result = JSON.parse(message.toString());
    switch (result.method) {
      case WebSocketMethods.CREATE:
        controller.createRoom(result)
        break;
      case WebSocketMethods.JOIN:
        controller.joinRoom(result)
        break;
      case WebSocketMethods.PLAY:
        controller.play(result)
        break;
    }
  })
})
