import "./AgentHeader.css";

function AgentHeader() {
  return (
    <header className="agent-header">
      <div className="header-logo">
        AGENT CONSOLE
      </div>

      <div className="work-status">
        ● Active & Accepting Chats
      </div>

      <div className="header-right">
        <span>🔔 4</span>

        <img
          src="https://i.pravatar.cc/40"
          alt="agent"
        />
      </div>
    </header>
  );
}

export default AgentHeader;