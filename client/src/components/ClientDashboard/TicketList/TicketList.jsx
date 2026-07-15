import TicketCard from "../Ticketcard/TicketCard";
import "./TicketList.css";

function TicketList({ tickets ,userId}) {

  const activeTickets = tickets.filter(
    (ticket) => ticket.status === "active"||"open"||"in-progress"||"pending"
  );

  // console.log("the active tickets are",activeTickets)
  return (
    <main className="ticket-list">
      <h5>Active Tickets ({activeTickets.length})</h5>

      {activeTickets.length>0?(
      activeTickets.map(ticket => (
        <TicketCard
          key={ticket.id}
          {...ticket}
        
        />
      ))):(
       <h5 style={{color:"red"}}>No ticket Found</h5>    
      )}


    </main>
  );
}

export default TicketList;