import "./Chat.css";


function MessageBubble({ message, isMine }) {
  return (
    <div className={`message-row ${isMine ? "mine" : "other"}`}>
      <div className={`message-bubble ${isMine ? "mine-bg" : "other-bg"}`}>
        <p>{message.message}</p>

        <small>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </small>
      </div>
    </div>
  );
}

export default MessageBubble;