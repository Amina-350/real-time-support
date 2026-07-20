import { useEffect, useState } from "react";
import "./TicketsTable.css";
import api from "../../../config/axios";

function TicketsTable() {
  const [ticketdata, setTicketData] = useState([]);

  useEffect(() => {
    const getTicketTable = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/ticket/getalltickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTicketData(res.data.tickets);
      } catch (error) {
        console.log("The error is -->", error);
      }
    };

    getTicketTable();
  }, []);

  const updateStatus = async (ticketId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.patch(
        `/ticket/adminUpdateTicket/${ticketId}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      // Update the ticket status in the UI
      setTicketData((prev) =>
        prev.map((ticket) =>
          ticket?._id === ticketId
            ? { ...ticket, status }
            : ticket
        )
      );
    } catch (error) {
      console.log("Status update failed:", error);
    }
  };

  return (
    <section className="tickets-table">
      <h2>LIVE TICKETS & AGENT ALLOCATION QUEUE</h2>

      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Assigned Agent</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {ticketdata.length > 0 ? (
            ticketdata.map((ticket) => (
              <tr key={ticket?._id}>
                <td>{ticket?._id}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.agentId?.name || "Not Assigned"}</td>

                <td>
                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      updateStatus(ticket?._id, e.target.value)
                    }
                  >
                             <option value="open">open</option>
            <option value="in-progress">in-progress</option>
            <option value="pending">pending</option>
            <option value="resolved">resolved</option>
             <option value="closed">closed</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TicketsTable;