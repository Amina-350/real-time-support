import { Link } from "react-router-dom"; // 1. Import Link
import "./CustomerCard.css";

function CustomerCard({
  _id, // 2. Add _id to your props destructured list
  subject,
  category,
  priority,
  status,
  attachment,
  createdAt,
}) {
  return (
    // 3. Wrap everything or link the card container. 
    // This removes default anchor styling so it looks like a normal card.
    <Link to={`/ticket/singleticket/${_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="customer-card" style={{ cursor: "pointer" }}>
        <h6><strong>Subject:</strong> {subject}</h6>

        <p>
          <strong>Category:</strong> {category}
        </p>

        <p>
          <strong>Priority:</strong> {priority}
        </p>

        <small>Created: {new Date(createdAt).toLocaleString()}</small>
      </div>
    </Link>
  );
}

export default CustomerCard;