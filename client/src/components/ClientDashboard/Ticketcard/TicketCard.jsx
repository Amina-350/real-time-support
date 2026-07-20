import "./Ticketcard.css";
import { Link } from "react-router-dom";
function TicketCard({
  _id,
  agentId,
  attachment,
  category,
  customerId,
  priority,
  status,
  subject,

}) {
  return (
    <div className="ticket-card">
      <h3>Subject:
      {subject}
      </h3>
<p>Agent Name: {agentId?.name}</p>
<p>Agent Email: {agentId?.email}</p>
      <div className="ticket-info">
             Priority: 
        <span className={`priority ${priority?.toLowerCase()}`}>
    {priority}
        </span>
   Status:
        <span className="status">
        {status}
        </span>
      </div>

      <div className="ticket-footer">


<Link to={`/chat-window/${_id}/${agentId?._id}`}>
  <button>Open Chat Window</button>
</Link>
      </div>
    </div>
  );
}

export default TicketCard;