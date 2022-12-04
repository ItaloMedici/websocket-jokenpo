const ip = window.location.host.split(":")[0]

export const ws = new WebSocket(`ws://${ip}:2121`)

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
  winner: string|number,
  choice?: Choices
  scores: number[]
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
