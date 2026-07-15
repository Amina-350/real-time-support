import Header from "../Header/Header";
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import TicketList from "../TicketList/TicketList";
import ResolvedTicketList from "../TicketList/ResolvedTicketList";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { jwtDecode } from "jwt-decode";
import socket from "../../../Socket/Socket";
function Clientmain() {
  const [selectedTab, setSelectedTab] = useState("active");
  const [tickets, settickets] = useState([]);
  let userId = null;
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);

    userId = decoded.id; // or decoded.userId depending on your JWT payload
  }

  // console.log("rthe userid is-->", userId);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = jwtDecode(token);

    socket.connect();
    console.log("the user connect to socket");
    socket.emit("join", decoded.id);
  }, []);

  useEffect(() => {
    const getmytickets = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/ticket/myticket", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        settickets(res.data.tickets);
        // console.log("the data is-->", res.data);
      } catch (error) {
        console.log("the error is ", error);
      }
    };
    getmytickets();
  }, []);

  // console.log("the ticet are-->", tickets);
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        {selectedTab === "active" && (
          <TicketList tickets={tickets} userId={userId} />
        )}
        {selectedTab === "resolved" && (
          <ResolvedTicketList tickets={tickets} userId={userId} />
        )}
      </div>
    </div>
  );
}

export default Clientmain;
