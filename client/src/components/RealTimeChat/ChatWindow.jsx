import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "./Chat.css";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

import api from "../../config/axios";
import socket from "../../Socket/Socket";

function ChatWindow() {
  const { id, reciverId } = useParams();

  const token = localStorage.getItem("token");

  let currentUserId = "";

  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.id;
  }

  const [messages, setMessages] = useState([]);


  // ==============================
// Mark notifications as read
// ==============================
useEffect(() => {
  const markNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/notification/read-ticket/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Notifications marked as read");
    } catch (error) {
      console.log(error);
    }
  };

  if (id) {
    markNotificationsRead();
  }
}, [id]);

//
  // ==============================
  // Load old conversation
  // ==============================
  const getConversation = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/message/conversation/${id}/${reciverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  }, [id, reciverId]);

  useEffect(() => {
    getConversation();
  }, [getConversation]);

  // ==============================
  // Receive realtime message
  // ==============================
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const ticketId =
        typeof newMessage.ticketId === "object"
          ? newMessage.ticketId._id
          : newMessage.ticketId;

      // Ignore messages from another ticket
      if (ticketId !== id) return;

      setMessages((prev) => {
          console.log("Received socket message:", newMessage);
        // Prevent duplicate message
        const exists = prev.some((msg) => msg._id === newMessage._id);

        if (exists) return prev;

        return [...prev, newMessage];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [id]);

  // ==============================
  // Send Message
  // ==============================
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/message/create-message",
        {
          ticketId: id,
          receiverId: reciverId,
          message: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Don't update state here.
      // Backend emits "new_message" to both sender and receiver.
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Support Chat</h3>
      </div>

      <div className="chat-body">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMine={msg.senderId._id === currentUserId}
            />
          ))
        )}
      </div>

      <MessageInput sendMessage={sendMessage} />
    </div>
  );
}

export default ChatWindow;
