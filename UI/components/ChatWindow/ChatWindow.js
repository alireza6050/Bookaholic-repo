import React, { useState } from "react";
import ChatBubble from "../ChatBubble/ChatBubble";
import { sendMessageToAI } from "../../services/chatService";
import SearchBar from "../SearchBar/SearchBar";
import "./ChatWindow.css";

/**
 * ChatWindow Component
 * Manages chat messages, sends user queries to AI, and displays responses.
 */
function ChatWindow() {
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState("");

  /**
   * Handles sending a message from the user to the AI.
   * @param {string} message - The user input message.
   */
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = { role: "user", content: message };
    setChatMessages([...chatMessages, newMessage]);
    setLoading(true);

    try {
      const startTime = performance.now();
      const { response } = await sendMessageToAI(message);
      const endTime = performance.now();
      const totalLatency = ((endTime - startTime) / 1000).toFixed(3);

      const formattedResponse = Array.isArray(response) ? formatBooks(response) : response;

      const aiMessage = { role: "ai", content: formattedResponse, latency: totalLatency };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, an error occurred while processing your request.", latency: "N/A" }
      ]);
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats book search results into JSX elements.
   * @param {Array} books - The array of book objects.
   * @returns {Array} JSX elements representing the book list.
   */
  const formatBooks = (books) => {
    return books
      .map(book => (
        <p key={book.title}>
          <strong>{book.title}</strong><br />
          <em>{book.author}</em><br />
          {book.summary}
        </p>
      ));
    };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {loading && <div className="loading-message">Searching...</div>}
      </div>
      <div className="input-container">
        <SearchBar 
          onSendMessage={handleSendMessage} 
          searchQuery={transcription} 
          setSearchQuery={setTranscription} 
        />

      </div>
    </div>
  );
}

export default ChatWindow;
