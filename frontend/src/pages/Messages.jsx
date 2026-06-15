import { useEffect, useRef, useState } from "react";
import {
    FaBriefcase,
    FaCheckDouble,
    FaComments,
    FaPaperPlane,
    FaUser,
} from "react-icons/fa";

import api from "../services/api";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchConversations();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/messages/my-conversations");
      setConversations(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const openConversation = async (conv) => {
    setSelected(conv);

    try {
      const res = await api.get(
        `/messages/application/${conv.application_id}`
      );

      setMessages(res.data);

      await api.put(
        `/messages/application/${conv.application_id}/read`
      );

      fetchConversations();

      connectWebSocket(conv.application_id);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const connectWebSocket = (applicationId) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/messages/${applicationId}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = async (event) => {
      const newMessage = JSON.parse(event.data);

      setMessages((prev) => {
        const exists = prev.some(
          (msg) => msg.id === newMessage.id
        );

        if (exists) {
          return prev;
        }

        return [...prev, newMessage];
      });

      if (
        selected &&
        newMessage.application_id === selected.application_id
      ) {
        await api.put(
          `/messages/application/${selected.application_id}/read`
        );
      }

      fetchConversations();
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    socketRef.current = ws;
  };

  const sendMessage = async () => {
    if (!selected || !text.trim()) {
      alert("Enter message");
      return;
    }

    try {
      await api.post("/messages/", {
        application_id: selected.application_id,
        message: text,
      });

      setText("");
    } catch (err) {
      alert(err.response?.data?.detail || "Message failed");
    }
  };

  const scrollBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fc" }}>
      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "25px 40px",
        }}
      >
        <h1>
          <FaComments /> Real-Time Messages
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",
          padding: "30px",
        }}
      >
        <div style={panel}>
          <h3>Conversations</h3>

          {conversations.length === 0 ? (
            <p>No conversations yet.</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.application_id}
                onClick={() => openConversation(conv)}
                style={{
                  position: "relative",
                  padding: "14px",
                  borderRadius: "12px",
                  background:
                    selected?.application_id ===
                    conv.application_id
                      ? "#dbeafe"
                      : "#f8fafc",
                  marginBottom: "10px",
                  cursor: "pointer",
                  border:
                    conv.unread_count > 0
                      ? "2px solid #2563eb"
                      : "1px solid #e5e7eb",
                }}
              >
                {conv.unread_count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#ef4444",
                      color: "white",
                      borderRadius: "999px",
                      padding: "3px 8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {conv.unread_count}
                  </span>
                )}

                <b>
                  <FaBriefcase /> {conv.job_title}
                </b>

                <p
                  style={{
                    margin: "6px 0",
                    color: "#64748b",
                  }}
                >
                  <FaUser /> {conv.other_user_name}
                </p>

                <small>{conv.status}</small>
              </div>
            ))
          )}
        </div>

        <div style={panel}>
          {!selected ? (
            <p>Select a conversation</p>
          ) : (
            <>
              <h3>{selected.job_title}</h3>

              <p style={{ color: "#64748b" }}>
                Chat with {selected.other_user_name}
              </p>

              <div
                style={{
                  height: "420px",
                  overflowY: "auto",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "15px",
                  background: "#f8fafc",
                }}
              >
                {messages.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        background:
                          m.sender_role === "candidate"
                            ? "#dbeafe"
                            : "#dcfce7",
                        padding: "12px",
                        borderRadius: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      <b>{m.sender_name}</b>

                      <p>{m.message}</p>

                      <small>
                        {new Date(m.created_at).toLocaleString(
                          "en-IN"
                        )}
                      </small>

                      {m.is_read && (
                        <span
                          style={{
                            marginLeft: "10px",
                            color: "#2563eb",
                            fontSize: "12px",
                          }}
                        >
                          <FaCheckDouble /> Read
                        </span>
                      )}
                    </div>
                  ))
                )}

                <div ref={bottomRef}></div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <input
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Type message..."
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />

                <button
                  onClick={sendMessage}
                  style={button}
                >
                  <FaPaperPlane /> Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const panel = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const button = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};