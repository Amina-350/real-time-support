import { useEffect } from "react";
import AdminHeader from "../AdminHeader/AdminHeader";
import AnalyticsOverview from "../AnalyticsOverview/AnalyticsOverview";
import TicketsTable from "../TicketsTable/TicketsTable";
import "./AdminDashboard.css";
import { jwtDecode } from "jwt-decode";
import socket from "../../../Socket/Socket";

function AdminDashboard() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = jwtDecode(token);

    socket.connect();

    socket.emit("join", decoded.id);

  }, []);

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <div className="admin-body">
        <AnalyticsOverview />

        <TicketsTable />
      </div>
    </div>
  );
}

export default AdminDashboard;
