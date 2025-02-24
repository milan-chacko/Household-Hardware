import React, { useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa"; // Icon for send button
import "../cssf/Chatai.css";
import BackButton from "../BackButton";

const Chatai = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false); // To disable input while AI is responding

  const handleSend = async () => {
    if (!message.trim() || loading) return; // Prevent sending empty messages or multiple requests

    const userId = localStorage.getItem("userId");
    setLoading(true); // Disable input and button

    try {
      const res = await axios.post("http://localhost:5555/ai/chat", {
        message,
        userId,
      });

      console.log("Response Data:", res.data);

      // Update chat history with user and AI response
      setChatHistory(res.data.history);
      setMessage(""); // Clear input field
    } catch (error) {
      console.error("Error:", error);
      setChatHistory([
        ...chatHistory,
        { role: "ai", text: "Error fetching response" },
      ]);
    } finally {
      setLoading(false); // Re-enable input and button
    }
  };

  return (
    <>
      <div style={{ padding: "17px 0px 0px 5rem" }}>
        {" "}
        <BackButton />
      </div>
      <div className="chat-container">
        <h2 className="chat-title">AI Chat</h2>
        <div className="chat-box">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.role}`}>
              <strong>{chat.role === "user" ? "You" : "AI"}:</strong>{" "}
              {chat.text}
            </div>
          ))}
          {loading && <div className="chat-message ai">AI is typing...</div>}
        </div>

        <div className="chat-input-container">
          <textarea
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading} // Disable input when AI is responding
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={loading}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatai;
