import { useState } from "react";
import {
  ArrowLeftOnRectangleIcon,
  PlusIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Button from "./components/Button";
import Input from "./components/Input";
import {
  Choices,
  Players,
  WebSocketMethods,
  WebSocketResponse,
  ws,
} from "./socket";
import { createRoom, joinRoom, play } from "./WebSocketService";

export const choices: {choice: Choices, emoji: string}[] = [
  {emoji: "✊", choice: "pedra"},
  {emoji: "️️🖐️️", choice: "papel"},
  {emoji: "✌", choice: "tesoura"},
];

function App() {
  const [clientID, setClientID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [roomIDText, setRoomIDText] = useState("");
  const [players, setPlayers] = useState<Players[]>([]);
  const [playerName, setPlayerName] = useState<string>("");
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
        console.log(
          "Room Joined: " + response.room.id + ", player: " + response.clientID
        );
        setPlayers(response.room.players);
        setRoomID(response.room.id);
        break;

      case WebSocketMethods.RESULT:
        alert("Result: " + response.gameResult);
        setSelectedPlay(undefined);
        break;

      case WebSocketMethods.WATING_SECOND_PLAYER:
        alert("Aguardando segundo jogador");
    }
  };

  const handleNewRoom = () => {
    if (clientID && playerName) createRoom(clientID);
  };

  const enterRoom = (event: any) => {
    event.preventDefault();
    if (clientID && playerName) {
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
    <main className="bg-primary h-screen px-72 py-16 flex flex-col gap-8">
      <div className="flex gap-8 items-end justify-center">
        <Input
          label="Nome:"
          placeholder="Digte seu nome"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <div className="flex gap-4 items-end">
          <Input
            label="Entrar em  uma sala: "
            disabled={!!roomID}
            placeholder="Digite o código..."
            value={roomIDText}
            onChange={(e) => setRoomIDText(e.target.value)}
          />
          <Button onClick={enterRoom} disabled={!!roomID}>
            <ArrowLeftOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
            ENTRAR
          </Button>
        </div>
        <Button onClick={handleNewRoom}>
          <PlusIcon className="h-6 w-6" aria-hidden="true" strokeWidth={2} />
          CRIAR NOVA SALA
        </Button>
      </div>

      {roomID ? (
        <>
          <div className="flex items-center justify-center gap-6">
            <span className="text-white opacity-70 text-lg font-bold">
              Código Sala:{" "}
            </span>
            <h1 className="text-white text-lg font-black">{roomID}</h1>
            <button
              className="p-2 bg-primary200 rounded-md text-secondary transition-all hover:bg-primary300"
              title="Copiar Código"
              onClick={() =>  navigator.clipboard.writeText(roomID)}
            >
              <DocumentDuplicateIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-7 bg-primary400 p-8 rounded-lg">
            {choices.map(({ choice, emoji }) => (
              <button
                className="h-60 w-full bg-primary200 rounded-lg text-white font-bold cursor-pointer"
                onClick={() => handlePlay(choice)}
                disabled={!!selectedPlay && selectedPlay !== choice}
              >
                <span className="text-9xl">{emoji}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}

      <h2>Players</h2>
      <ul>
        {players &&
          players.map((p) => <li key={p.clientID}>{p.clientName}</li>)}
      </ul>
    </main>
  );
}

export default App;
