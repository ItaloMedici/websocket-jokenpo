import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import emojiData from "react-apple-emojis/src/data.json";
import { EmojiProvider } from "react-apple-emojis";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <EmojiProvider data={emojiData}>
      <App />
    </EmojiProvider>
  </React.StrictMode>
);
