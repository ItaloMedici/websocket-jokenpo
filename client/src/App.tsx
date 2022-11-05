import { useState } from "react";
import {
  Choices,
  Players,
  WebSocketMethods,
  WebSocketResponse,
  ws,
} from "./socket";
import { createRoom, joinRoom, play } from "./WebSocketService";
export const choices: Choices[] = ["pedra", "papel", "tesoura"];

function App() {
  const [clientID, setClientID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [roomIDText, setRoomIDText] = useState("");
  const [players, setPlayers] = useState<Players[]>([]);
  const [playerName, setPlayerName] = useState("italo");
  const [selectedPlay, setSelectedPlay] = useState<Choices>();

  ws.onmessage = (message) => {
    const response = JSON.parse(message.data) as WebSocketResponse;

    switch (response.method) {
      case WebSocketMethods.CONNECT:
        console.log("Client connected id: " + response.clientID);
        setClientID(response.clientID);
        break;

      case WebSocketMethods.CREATE:
        console.log("Room created: " + response.room.id);
        setRoomID(response.room.id);
        joinRoom(clientID, playerName, response.room.id);
        break;

      case WebSocketMethods.JOIN:
        console.log("Room Joined: " + response.room.id + ", player: " + response.clientID);
        setPlayers(response.room.players);
        setRoomID(response.room.id);
        break;

      case WebSocketMethods.RESULT:
        alert("Result: " + response.gameResult);
        setSelectedPlay(undefined)
        break;

      case WebSocketMethods.WATING_SECOND_PLAYER:
        alert("Aguardando segundo jogador");
    }
  };

  const handleNewRoom = () => {
    if (clientID) createRoom(clientID);
  };

  const enterRoom = (event: any) => {
    event.preventDefault();
    if (clientID) {
      joinRoom(clientID, playerName, roomIDText);
    }
  };

  const handlePlay = (c: Choices) => {
    if (!selectedPlay) {
      setSelectedPlay(c);
      play(clientID, roomID, c);
    }
  };

  return (
    <>
      <h2>sala: {roomID} {roomID && <button onClick={() => navigator.clipboard.writeText(roomID)}>Copiar ID</button>}</h2>
      <input
        placeholder="Digte seu nome"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        required
      />
      <br />
      <br />
      <button onClick={handleNewRoom}>Criar sala</button><br/>
      <input
        disabled={!!roomID}
        placeholder="Entrar na sala"
        value={roomIDText}
        onChange={(e) => setRoomIDText(e.target.value)}
      />
      <button onClick={enterRoom} disabled={!!roomID}>
        Entrar
      </button>
      <h2>Players</h2>
      <ul>
        {players &&
          players.map((p) => <li key={p.clientID}>{p.clientName}</li>)}
      </ul>
      <h2>JOGAR</h2>
      {choices.map((c) => (
        <button
          onClick={() => handlePlay(c)}
          disabled={!!selectedPlay && selectedPlay !== c}
        >
          {c}
        </button>
      ))}
    </>
  );
}

export default App;
