import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./CustomerCard.css"; // Optional: For your custom styling
import api from "../../../config/axios";

function TicketDetailPage() {
  const { id } = useParams(); // Extracts the ticket ID from the URL path (/tickets/:id)
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get(`/ticket/singleticket/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTicket(response.data.ticketres);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTicketDetails();
  }, [id, BACKEND_URL]);

  const updateStatus = async (ticketId, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.patch(
        `/ticket/adminUpdateTicket/${ticketId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      // Update the single ticket object
      setTicket((prev) => ({
        ...prev,
        status,
      }));
    } catch (error) {
      console.log("Status update failed:", error);
    }
  };

  if (loading) return <div className="loading">Loading ticket details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!ticket) return <div className="error">No ticket found.</div>;

  // Handle attachment cleanup logic
  const cleanPath = ticket.attachment
    ? ticket.attachment.replace(/public[\\/]/, "").replace(/\\/g, "/")
    : "";
  const fileUrl = ticket.attachment ? `${BACKEND_URL}/${cleanPath}` : null;
console.log("the ticket detail is -->",ticket)
  return (
    <div className="ticket-detail-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>

        <div className="agent-link agent-linkp">
          <Link to={`/chat-window/${ticket?._id}/${ticket.agentId}`}>
            Start Chat with Customer
          </Link>
          <Link to={`/user-detail-page/${ticket.agentId}`}>
            Check Customer Detail
          </Link>
        </div>
      </div>

      <div className="ticket-detail-header">
        <h4>
          {" "}
          <label style={{ color: "red" }}>Ticket Subject: </label>{" "}
          {ticket.subject}
        </h4>
        <span className={`status-badge ${ticket.status}`}>
          <label style={{ color: "red" }}>Ticket Status: &nbsp;</label>
          <select
            value={ticket.status}
            onChange={(e) => updateStatus(ticket?._id, e.target.value)}
          >
            <option value="open">open</option>
            <option value="in-progress">in-progress</option>
            <option value="pending">pending</option>
            <option value="resolved">resolved</option>
            <option value="closed">closed</option>
          </select>
        </span>
      </div>

      <hr />

      <div className="ticket-info-grid">
        <div className="info-group">
          <strong>Category:</strong>
          <p>{ticket.category}</p>
        </div>

        <div className="info-group">
          <strong>Priority:</strong>
          <p className={`priority-${ticket.priority}`}>{ticket.priority}</p>
        </div>

        <div className="info-group">
          <strong>Created At:</strong>
          <p>{new Date(ticket.createdAt).toLocaleString()}</p>
        </div>

        <div className="info-group">
          <strong>Ticket ID:</strong>
          <p>
            <code
              style={{
                background: "#f4f4f4",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {ticket?._id}
            </code>
          </p>
        </div>
      </div>

      {/* Description / Body field if you have it in your schema */}
      {ticket.description && (
        <div className="ticket-description">
          <strong>Description:</strong>
          <p>{ticket.description}</p>
        </div>
      )}

      {/* Render attachments layout */}
      {fileUrl && (
        <div className="ticket-attachment-section">
          <h3>Attachment</h3>

          <div className="image-preview-container">
            <img
              src={fileUrl}
              alt="Uploaded attachment preview"
              className="detail-img-preview"
            />
            <br />
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketDetailPage;
