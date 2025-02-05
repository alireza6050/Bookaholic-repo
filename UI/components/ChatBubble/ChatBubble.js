import React from "react";
import "./ChatBubble.css";
import logo from "../../assets/images/logo.png";
import user from "../../assets/images/user.png";

function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`chat-bubble-container ${isUser ? "user" : "ai"}`}>
      {!isUser && <img src={logo} alt="AI Avatar" className="avatar" />}
      <div className="chat-bubble">
        <p>{message.content}</p>
        {!isUser && message.latency && (
          <span className="latency-text">response time: {message.latency} sec</span>
        )}
      </div>
      {isUser && <img src={user} alt="User Avatar" className="avatar" />}
    </div>
  );
}

export default ChatBubble;
