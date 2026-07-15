import { useEffect, useState } from "react";
import "./AdminDashboard/AdminDashboard.css";
import api from "../../config/axios";
import { Link } from "react-router-dom";

function Allusers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  // Fetch all users
  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/user/getallusers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.allusers);
    } catch (error) {
      console.log(error);
    }
  };

  // Block user
  const blockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/user/blockuser/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, isBlocked: true }
            : user
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Unblock user
  const unblockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/user/unblockUser/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, isBlocked: false }
            : user
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  {user.isBlocked ? (
                    <button
                      onClick={() => unblockUser(user._id)}
                      className="unblock-btn"
                    >
                      Unblock User
                    </button>
                  ) : (
                    <button
                      onClick={() => blockUser(user._id)}
                      className="block-btn"
                    >
                      Block User
                    </button>
                  )}
                </td>

                <td>
                  <Link to={`/user-detail-page/${user._id}`}>
                    Check
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No customers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Allusers;