import { useEffect, useState } from "react";
import "./Header.css";
import socket from "../../../Socket/Socket";
import api from "../../../config/axios";


function Header() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
//


  // =============================
  // Load notifications on page load
  // =============================
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/notification/my-notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications(res.data.notifications);
      } catch (error) {
        console.log(error);
      }
    };

    getNotifications();
  }, []);


  useEffect(() => {
  const handleNotificationRead = (ticketId) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        const currentTicketId =
          typeof notification.ticketId === "object"
            ? notification.ticketId._id
            : notification.ticketId;

        if (currentTicketId === ticketId) {
          return {
            ...notification,
            isRead: true,
          };
        }

        return notification;
      })
    );
  };

  socket.on("notification_read", handleNotificationRead);

  return () => {
    socket.off("notification_read", handleNotificationRead);
  };
}, []);

  // =============================
  // Receive realtime notification
  // =============================
  useEffect(() => {
    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new_notification", handleNotification);

    return () => {
      socket.off("new_notification", handleNotification);
    };
  }, []);

  const unreadCount = notifications.filter(
    (n) => n.isRead === false
  ).length;

  return (
    <header className="header">
      <div className="logo-section">
        <h2>SupportHub</h2>
      </div>

      <div className="header-right">
        {/* Notification */}
        <div
          className="notification-container"
          onClick={() =>
            setShowNotifications(!showNotifications)
          }
        >
          <div className="notification">
            🔔

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length === 0 ? (
                <p>No Notifications</p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item._id}
                    className={`notification-item ${
                      !item.isRead ? "unread" : ""
                    }`}
                  >
                    <h5>{item.title}</h5>

                    <p>{item.message}</p>

                    <small>
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User */}
        <div className="user-info">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
          />

          {/* <div>
            <h4>John Doe</h4>
            <p>Online</p>
          </div> */}
        </div>
      </div>
    </header>
  );
}

export default Header;