import { Clients, Rooms, WebSocketMethods, WebSocketResult } from "./Contants";
import { guid } from "./utils";
import { WebSocket } from "ws"

export class WebSocketController {
  clients: Clients = {}
  rooms: Rooms = {}
  ws: WebSocket;

  constructor(ws: WebSocket, clients: Clients, rooms: Rooms) {
    this.ws = ws;
    this.clients = clients;
    this.rooms = rooms;
    this.connectClient()
  }

  connectClient() {
    const clientID = guid();
    this.clients[clientID] = {
      connection: this.ws
    }

    const payLoad = {
      method: WebSocketMethods.CONNECT,
      clientID: clientID
    }

    this.ws.send(JSON.stringify(payLoad))
  }

  createRoom(result: WebSocketResult) {
    const clientID = result.clientID;
    const roomID = guid();

    this.rooms[roomID] = {
      id: roomID,
      players: []
    }

    const payLoad: Partial<WebSocketResult> = {
      method: WebSocketMethods.CREATE,
      room: this.rooms[roomID]
    }

    const con = this.clients[clientID].connection;
    con.send(JSON.stringify(payLoad));
  }

  joinRoom(result: WebSocketResult) {
    const { clientID, clientName, roomID } = result;
    const room = this.rooms[roomID];

    if (!room?.players || room?.players?.length >= 2) {
      console.debug("room players", room?.players)
      return;
    }

    room.players.push({
      clientID,
      clientName,
    })

    //start the game
    //if (room.clients.length === 2) updateGameState();

    const payLoad = {
      method: WebSocketMethods.JOIN,
      room,
      clientID
    }

    //Notifica todos os clientes que outros entraram
    room.players.forEach(c => {
      this.clients[c.clientID].connection.send(JSON.stringify(payLoad))
    })
  }

  play(result: WebSocketResult) {
    const { clientID, roomID, choice } = result;

    let room = this.rooms[roomID];
    let player = room.players.find(p => p.clientID === clientID);

    if (choice && player) {
      player.play = choice;
    }

    let allPlayersHadPlayed = room.players.length === 2 && room.players.every(p => p.play)

    if (allPlayersHadPlayed) {
      let player1 = room.players[0];
      let player2 = room.players[1];
      let winner;
      let scores = []

      if (room.players[0].score === undefined) room.players[0].score = 0
      if (room.players[1].score === undefined) room.players[1].score = 0

      if (player1.play === player2.play) {
        winner = -1
      } else if (player1.play === "pedra") {
        if (player2.play === "papel") {
          winner = room.players[1].clientID
          room.players[1].score++;
        } else {
          winner = room.players[0].clientID
          room.players[0].score++;
        }
      } else if (player1.play === "tesoura") {
        if (player2.play === "pedra") {
          winner = room.players[1].clientID
          room.players[1].score++;
        } else {
          winner = room.players[0].clientID
          room.players[0].score++;
        }
      } else if (player1.play === "papel") {
        if (player2.play === "tesoura") {
          winner = room.players[1].clientID
          room.players[1].score++;
        } else {
          winner = room.players[0].clientID
          room.players[0].score++;
        }
      }

      scores = [ room.players[0].score, room.players[1].score ]

      if (winner !== undefined) {
        const payLoad = {
          method: WebSocketMethods.RESULT,
          winner,
          scores
        }

        room.players.forEach(c => {
          this.clients[c.clientID].connection.send(JSON.stringify(payLoad))
          c.play = undefined;
        })
      }
    } else {
      const payLoad = {
        method: WebSocketMethods.WATING_SECOND_PLAYER,
      }
      this.clients[clientID].connection.send(JSON.stringify(payLoad))
    }
  }
}

