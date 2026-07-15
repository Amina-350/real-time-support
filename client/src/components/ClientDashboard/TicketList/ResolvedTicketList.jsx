import TicketCard from "../Ticketcard/TicketCard";
import "./TicketList.css";

function ResolvedTicketList({ tickets }) {
  const resolveTickets = tickets.filter(
    (ticket) => ticket.status === "close" || ticket.status === "resolved",
  );

  return (
    <main className="ticket-list">
      <h5>Resolved Tickets ({resolveTickets.length})</h5>
 {resolveTickets.length > 0 ? (
        resolveTickets.map((ticket) => (
          <TicketCard key={ticket.id} {...ticket} />
        ))
      ) : (
    <h5 style={{color:"red"}}>No ticket Found</h5>
      )}

    </main>
  );
}

export default ResolvedTicketList;
