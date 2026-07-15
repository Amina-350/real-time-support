import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../config/axios";
import "./Sidebar/Sidebar.css";

function CustomerChatList() {
  const [chats, setChats] = useState([]);

  const token = localStorage.getItem("token");

  let currentUserId = "";

  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.id;
  }

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await api.get("/message/getMyChats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChats(res.data.chats);
        console.log("Chats:", res.data.chats);
      } catch (error) {
        console.log(error);
      }
    };

    getChats();
  }, [token]);

  return (
    <div className="chat-list-container">
      <h2>My Chat List</h2>

      {chats.length === 0 ? (
        <p>No chats found.</p>
      ) : (
        chats.map((chat) => {
          // Show the other user instead of yourself
          const otherUser =
            chat.senderId._id === currentUserId
              ? chat.receiverId
              : chat.senderId;

          return (
            <Link
              key={chat.ticketId._id}
              to={`/chat-window/${chat.ticketId._id}/${otherUser._id}`}
              className="chat-card"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="chat-header">
                <h4>{otherUser.name}</h4>

                <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
              </div>

              <p>
                <strong>Ticket Subject:</strong> {chat.ticketId.subject}
              </p>
              {/* 
              <p>
                <strong>Priority:</strong> {chat.ticketId.priority}
              </p>

              <p>
                <strong>Status:</strong> {chat.ticketId.status}
              </p> */}

              <p>
                <strong>Last Message:</strong> {chat.lastMessage}
              </p>
            </Link>
          );
        })
      )}
    </div>
  );
}

export default CustomerChatList;
