import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
function Sidebar({ selectedTab, setSelectedTab }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <Link to="/create-new-ticket">
        <button className="new-ticket-btn">+ New Support Ticket</button>
      </Link>

      <div className="menu-section">
        <h5>📂 My Tickets</h5>

        <ul>
          <li
            // className={selectedTab === "active" ? "active-tab" : ""}
            onClick={() => setSelectedTab("active")}
          >
            Active
          </li>

          <li
            // className={selectedTab === "resolved" ? "active-tab" : ""}
            onClick={() => setSelectedTab("resolved")}
          >
            Resolved
          </li>
        </ul>
      </div>
      <Link
        to="/customer-chat"
        style={{ textDecoration: "none", color: "black" }}
      >
        <p style={{ marginLeft: "15px" }}>My ChatList</p>
      </Link>

      {/* <div className="menu-item">⚙️ Settings</div> */}

      <div className="menu-item logout" onClick={logout}>
        🔓 Logout
      </div>
    </aside>
  );
}

export default Sidebar;
