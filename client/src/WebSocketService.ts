import { Choices, WebSocketMethods, WebSocketResponse, ws } from "./socket";


export const createRoom = (clientID: string) => {
  const payload: Partial<WebSocketResponse> = {
    method: WebSocketMethods.CREATE,
    clientID,
  };
  ws.send(JSON.stringify(payload));
}

export const joinRoom = (clientID: string, clientName: string, roomID: string) => {
  const payload: Partial<WebSocketResponse> = {
    method: WebSocketMethods.JOIN,
    clientID,
    clientName,
    roomID
  };
  ws.send(JSON.stringify(payload));
}

export const play = (clientID: string, roomID: string, choice: Choices) => {
  const payload: Partial<WebSocketResponse> = {
    method: WebSocketMethods.PLAY,
    clientID,
    roomID,
    choice
  };
  ws.send(JSON.stringify(payload));
}