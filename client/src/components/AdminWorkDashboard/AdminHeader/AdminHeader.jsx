import "./AdminHeader.css";
import { Link } from "react-router-dom";

function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="logo">
        ADMIN METRICS here
      </div>

      <nav className="nav-links">
        <Link to="/all-users">All Users</Link>
     
        {/* <Link to="/admin/tickets">Tickets</Link> */}
        {/* <Link to="/admin/system-configurations">System Configurations</Link> */}
      </nav>
    </header>
  );
}

export default AdminHeader;