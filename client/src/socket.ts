
export const ws = new WebSocket("ws://localhost:2121")

export enum WebSocketMethods {
  CONNECT = "connect",
  CREATE = "create",
  JOIN = "join",
  PLAY = "play",
  RESULT = "result",
  WATING_SECOND_PLAYER = "waitingSecondPlayer",
}

export type WebSocketResponse = {
  method: WebSocketMethods,
  clientID: string,
  clientName: string;
  roomID: string,
  room: Room,
  gameResult: string,
  choice?: Choices
}

export type Clients = {
  [clientID: string]: Client
}

type Client = {
  connection: WebSocket
}

export type Rooms = {
  [roomID: string]: Room
}

type Room = {
  id: string;
  players: Players[]
}

export type Players = {
  clientID: string, 
  clientName: string,
  play?: Choices
}

export type Choices = "pedra" | "papel" | "tesoura"
