import React from "react";
import Emoji from "react-apple-emojis/dist/Emoji";

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
      emoji: "neutral-face",
      label: "Empate!",
      color: "bg-tie",
    },
  };

  return (
    <div
      className={`${visible ? "animate-enter" : "animate-leave"} ${
        getVariant[variant].color
      } flex items-center rounded-lg p-2 gap-3 transition-all duration-5000 shadow-lg `}
    >
      <div className="rounded-lg bg-white60 flex items-center justify-center p-1">
        <Emoji name={getVariant[variant].emoji} width={24} />
      </div>
      <span className="text-lg font-bold text-white mr-1">
        {getVariant[variant].label}
      </span>
    </div>
  );
};

export default Toast;
