import React, { useState } from "react";
import { api } from "../api";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AskAI() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const r = await api.post("/ai/ask", { question: q });
      setAns(r.data.answer);
    } catch (error) {
      setAns("Sorry, I couldn't get an answer. Please try again.");
      console.error("Error asking AI:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1rem"
        }}>
          <div style={{
            background: "white",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              textAlign: "center",
              marginBottom: "2rem"
            }}>
              <h1 style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#22c55e",
                marginBottom: "0.25rem"
              }}>
                Ask AI Assistant
              </h1>
              <p style={{
                fontSize: "1rem",
                color: "#333",
                marginBottom: "1rem"
              }}>
                Get financial insights and advice
              </p>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              <input
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  width: "100%",
                  boxSizing: "border-box"
                }}
                placeholder="Ask your finance question..."
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && ask()}
              />
              <button
                style={{
                  padding: "1rem 2rem",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                  opacity: loading ? 0.7 : 1
                }}
                onClick={ask}
                disabled={loading}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#16a34a")}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#22c55e")}
              >
                {loading ? "🤔 Thinking..." : "🤖 Ask AI"}
              </button>

              {ans && (
                <div style={{
                  marginTop: "1rem",
                  padding: "1.5rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0"
                }}>
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "0.5rem"
                  }}>
                    AI Response:
                  </h3>
                  <p style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap"
                  }}>
                    {ans}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
