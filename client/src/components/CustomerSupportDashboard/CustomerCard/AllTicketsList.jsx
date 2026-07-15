import { useEffect, useState } from "react";
import CustomerCard from "../CustomerCard/CustomerCard";

import api from "../../../config/axios";

function AllTicketsList() {
  const [mytic, setMytic] = useState([]);

  useEffect(() => {
    const getMyTickets = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/ticket/myticket", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMytic(res.data.tickets);
      } catch (error) {
        console.log("Error fetching tickets:", error);
      }
    };

    getMyTickets();
  }, []);

  return (
    <div className="agent-inbox" style={{padding:"20px"}}>
      <h3>Inbox (Assigned)</h3>

      {mytic.length > 0 ? (
        mytic.map((item) => (
          <CustomerCard
            key={item._id}
            {...item}
          />
        ))
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
}

export default AllTicketsList;