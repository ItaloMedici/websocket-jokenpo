import React from "react";
import Emoji from "react-apple-emojis/dist/Emoji";
import { Toaster } from "react-hot-toast";

// import { Container } from './styles';

type ToastProps = {
  variant: "winner" | "loser" | "wating" | "play" | "tie";
  visible: boolean;
};

const Toast: React.FC<ToastProps> = ({ variant, visible }) => {
  const getVariant = {
    winner: {
      emoji: "star-struck",
      label: "Parabéns, você venceu!",
      color: "bg-winner",
    },
    loser: {
      emoji: "crying-face",
      label: "Que pena, você perdeu.",
      color: "bg-loose",
    },
    wating: {
      emoji: "shushing-face",
      label: "Aguardando jogador...",
      color: "bg-wating",
    },
    play: {
      emoji: "joystick",
      label: "Faça sua jogada",
      color: "bg-makePlay",
    },
    tie: {
      emoji: "face-with-diagonal-mouth",
      label: "Empate!",
      color: "bg-tie",
    },
  };

  return (
    <div
      className={`${visible ? "animate-enter" : "animate-leave"} ${
        getVariant[variant].color
      } flex items-center rounded-xl p-3 gap-4 transition-all duration-5000 shadow-lg `}
    >
      <div className="rounded-xl bg-white60 flex items-center justify-center p-2">
        <Emoji name={getVariant[variant].emoji} width={34} />
      </div>
      <span className="text-xl font-black text-white">
        {getVariant[variant].label}
      </span>
    </div>
  );
};

export default Toast;
