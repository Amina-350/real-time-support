import { useEffect } from "react";
import CustomerChatList from "../../ClientDashboard/CustomerChatList";
import AgentHeader from "../AgentHeader/AgentHeader";
import AllTicketsList from "../CustomerCard/AllTicketsList";

import "./AgentDashboard.css";
import { jwtDecode } from "jwt-decode";
import socket from "../../../Socket/Socket";

function AgentDashboard() {
   useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  const decoded = jwtDecode(token);

  socket.connect();

  socket.emit("join", decoded.id);
}, []);
  return (
    <div className="agent-dashboard">
      <AgentHeader />

      <div className="agent-layout">
<AllTicketsList/>
<CustomerChatList/>

      </div>
    </div>
  );
}

export default AgentDashboard;