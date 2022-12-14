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
import toast, { Toaster } from "react-hot-toast";
import Emoji from "react-apple-emojis/dist/Emoji";
import Toast from "./components/Toast";

export const choices: { choice: Choices; emoji: string }[] = [
  { emoji: "raised-fist", choice: "pedra" },
  { emoji: "victory-hand", choice: "tesoura" },
  { emoji: "raised-hand", choice: "papel" },
];

function App() {
  const [clientID, setClientID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [roomIDText, setRoomIDText] = useState("");
  const [players, setPlayers] = useState<Players[]>([]);
  const [playerName, setPlayerName] = useState<string>("");
  const [selectedPlay, setSelectedPlay] = useState<Choices>();
  const [scores, setScores] = useState<number[]>([0, 0]);

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
        toast.custom((t) => <Toast variant="play" visible={t.visible} />);
        break;

      case WebSocketMethods.RESULT:
        setScores(response.scores);
        if (response.winner === -1) {
          toast.custom((t) => <Toast variant="tie" visible={t.visible} />);
        } else if (response.winner === clientID) {
          toast.custom((t) => <Toast variant="winner" visible={t.visible} />);
        } else {
          toast.custom((t) => <Toast variant="loser" visible={t.visible} />);
        }
        setSelectedPlay(undefined);
        break;

      case WebSocketMethods.WATING_SECOND_PLAYER:
        toast.custom((t) => <Toast variant="wating" visible={t.visible} />);
        break;
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
    <main className="px-52 py-8 justify-center flex flex-col gap-7 items-center max-xl:px-14">
      <div className="flex gap-8 items-end justify-center max-md:flex-col max-md:items-center">
        <Input
          label="Nome:"
          placeholder="Digte seu nome"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          disabled={!!roomID}
        />

        <div className="flex gap-4 items-end max-sm:items-center max-sm:flex-col">
          <Input
            label="Entrar em  uma sala: "
            disabled={!!roomID}
            placeholder="Digite o c??digo..."
            value={roomIDText}
            onChange={(e) => setRoomIDText(e.target.value)}
          />
          <Button onClick={enterRoom} disabled={!!roomID}>
            <ArrowLeftOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
            ENTRAR
          </Button>
        </div>
        <Button onClick={handleNewRoom} disabled={!!roomID}>
          <PlusIcon className="h-6 w-6" aria-hidden="true" strokeWidth={2} />
          CRIAR NOVA SALA
        </Button>
      </div>

      {roomID ? (
        <>
          <div className="flex items-center justify-center gap-6 max-sm:flex-col">
            <span className="text-white opacity-70 text-lg font-bold">
              C??digo Sala:
            </span>
            <h1 className="text-white text-lg font-black">{roomID}</h1>
            <button
              className="p-2 bg-primary200 rounded-md text-secondary transition-all hover:bg-primary300"
              title="Copiar C??digo"
              onClick={() => navigator.clipboard.writeText(roomID)}
            >
              <DocumentDuplicateIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center w-3/6">
            <h3 className="bg-primary300 p-2 rounded-md px-20 py-2 w-full text-center text-white font-black">
              Advers??rios
            </h3>
            <div className="flex flex-row gap-3 my-1 justify-between items-center w-full max-[600px]:flex-col">
              <h2 className="bg-primary200 p-2 rounded-md px-10 text-center  text-white font-semibold flex-1 max-[600px]:w-full">
                {scores && scores[0] + " pts - "}
                {players[0]?.clientName}
              </h2>
              <h2 className="text-primaryX text-xl font-bold mx-1">X</h2>
              <h2 className="bg-primary200 p-2 rounded-md px-17 text-center text-white font-semibold flex-1 max-[600px]:w-full">
                {scores && scores[1] + " pts - "}
                {players[1]?.clientName ?? "vazio"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 bg-primary400 p-5 rounded-xl max-[600px]:grid-rows-2 max-[600px]:grid-cols-2">
            {choices.map(({ choice, emoji }) => (
              <button
                className="
                  group
                  h-40 w-40 bg-primary200 rounded-lg text-white font-bold cursor-pointer
                  max-sm:h-32 max-sm:w-32
                  transition delay-75 duration-300
                  disabled:bg-primary300 disabled:cursor-default
                "
                onClick={() => handlePlay(choice)}
                disabled={!!selectedPlay && selectedPlay !== choice}
              >
                <Emoji className="m-auto" name={emoji} width={80} />
                <div
                  className="
                    text-md font-bold 
                    transition-all delay-75 duration-300
                    h-0 overflow-hidden
                    opacity-90
                    tracking-wider
                    group-hover:h-6 group-hover:mt-2
                  "
                >
                  {choice.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </>
      ) : null}

      <Toaster position="bottom-center" />
    </main>
  );
}

export default App;
