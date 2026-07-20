import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../config/axios";
import "./AdminDashboard/AdminDashboard.css";

function UserDetailPage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(`/user/getsigleprofile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
        console.log("the user data is",res.data)
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [id]);

  if (!user) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="users-container">
      <h2>Customer Details</h2>

      <div className="user-details-card">
        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <p>
          <strong>Phone:</strong> {user.phone}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <p>
          <strong>User ID:</strong> {user?._id}
        </p>

        <Link to="/all-users">← Back to Users</Link>
      </div>
    </div>
  );
}

export default UserDetailPage;