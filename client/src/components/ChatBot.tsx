import React, { useState, useRef, useEffect } from "react";
import { api } from "../api";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your AI financial assistant. Ask me anything about your finances!", sender: "bot", timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const ask = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const r = await api.post("/ai/ask", { question: input });
      const botMessage: Message = {
        text: r.data.answer,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I couldn't get an answer. Please try again.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Error asking AI:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          width: "380px",
          height: "550px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            color: "white",
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🤖</span>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0",
                lineHeight: "1"
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto",
            background: "#f9fafb",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div style={{
                  maxWidth: "75%",
                  padding: "0.75rem 1rem",
                  borderRadius: msg.sender === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  background: msg.sender === "user" 
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" 
                    : "white",
                  color: msg.sender === "user" ? "white" : "#374151",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                display: "flex",
                justifyContent: "flex-start"
              }}>
                <div style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "12px 12px 12px 0",
                  background: "white",
                  color: "#6b7280",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontSize: "0.875rem"
                }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: "1rem",
            background: "white",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "0.5rem"
          }}>
            <input
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "0.875rem",
                outline: "none"
              }}
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && ask()}
            />
            <button
              style={{
                padding: "0.75rem 1rem",
                background: loading ? "#9ca3af" : "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s ease"
              }}
              onClick={ask}
              disabled={loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          color: "white",
          border: "none",
          fontSize: "2rem",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? "×" : "🤖"}
      </button>
    </>
  );
}

