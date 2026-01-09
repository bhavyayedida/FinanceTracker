import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { removeToken } from "../utils/auth";
import { ROUTES } from "../utils/constants";
import { Transaction } from "../types";
import ProtectedRoute from "../components/ProtectedRoute";
import ChatBot from "../components/ChatBot";

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState<"food" | "entertainment" | "travel" | "fees" | "emi" | "other">("food");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      await api.post("/transactions", {
        title,
        amount: Number(amount),
        type,
        category,
        date: date || new Date(),
      });
      setTitle("");
      setAmount("");
      setCategory("food");
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      loadTransactions();
    } catch (error) {
      console.error("Failed to add transaction", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      loadTransactions();
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate(ROUTES.LOGIN);
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <ProtectedRoute>
      <>
        <ChatBot />
        <div style={{
          minHeight: "100vh",
          background: "#f5f5f5",
          padding: "2rem 1rem",
          fontFamily: "Arial, sans-serif"
        }}>
        <div style={{
          margin: "0 auto",
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
              Finance Tracker
            </h1>
            <p style={{
              fontSize: "1rem",
              color: "#333",
              marginBottom: "1rem"
            }}>
              Expense Tracker
            </p>
            <div style={{ textAlign: "right", marginTop: "-3rem" }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div style={{
            marginBottom: "2rem",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#333"
            }}>
              Balance: ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              fontSize: "1rem"
            }}>
              <div>
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>Income</span>
                <span style={{ color: "#22c55e", marginLeft: "0.5rem" }}>
                  ₹{income.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span style={{ color: "#ef4444", fontWeight: "bold" }}>Expense</span>
                <span style={{ color: "#ef4444", marginLeft: "0.5rem" }}>
                  ₹{expense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            background: "#f9fafb",
            borderRadius: "8px"
          }}>
            <form onSubmit={handleAdd}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr auto",
                gap: "0.75rem",
                marginBottom: "1rem",
                alignItems: "end"
              }}>
                <input
                  type="text"
                  placeholder="Description"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.95rem"
                  }}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.95rem"
                  }}
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.95rem"
                  }}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as "food" | "entertainment" | "travel" | "fees" | "emi" | "other")}
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.95rem",
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  <option value="food">Food</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="travel">Travel</option>
                  <option value="fees">Fees</option>
                  <option value="emi">EMI</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "income" | "expense")}
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.95rem",
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#333"
            }}>
              Transactions
            </h3>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                Loading...
              </div>
            ) : transactions.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "2rem",
                color: "#666",
                background: "#f9fafb",
                borderRadius: "4px"
              }}>
                No transactions yet
              </div>
            ) : (
              <div>
                {transactions.map((t) => (
                  <div
                    key={t._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      marginBottom: "0.5rem",
                      background: "#f9fafb",
                      borderRadius: "4px",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: "1rem",
                        marginBottom: "0.25rem"
                      }}>
                        <span style={{ fontWeight: "500", color: "#333" }}>
                          {t.title}
                        </span>
                        <span style={{
                          fontWeight: "bold",
                          marginLeft: "0.5rem",
                          color: t.type === "income" ? "#22c55e" : "#ef4444"
                        }}>
                          - ₹{Number(t.amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div style={{
                        fontSize: "0.875rem",
                        color: "#666",
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center"
                      }}>
                        <span>{formatDate(t.date)}</span>
                        {t.category && (
                          <span style={{
                            background: "#e5e7eb",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            textTransform: "capitalize"
                          }}>
                            {t.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(t._id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </>
    </ProtectedRoute>
  );
}

function DashboardWithAuth() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

export default DashboardWithAuth;
