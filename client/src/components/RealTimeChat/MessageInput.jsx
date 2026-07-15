import { useState } from "react";
import "./Chat.css";

function MessageInput({ sendMessage }) {

  const [text, setText] = useState("");

  const handleSend = () => {

    sendMessage(text);

    setText("");
  };

  return (
    <div className="chat-input">

      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleSend}>
        Send
      </button>

    </div>
  );
}

export default MessageInput;