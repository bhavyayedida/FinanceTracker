import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { api } from "../api";
import { Transaction } from "../types";
import ProtectedRoute from "../components/ProtectedRoute";
import ChatBot from "../components/ChatBot";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

function SpendingCharts() {
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
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

  // Filter only expenses
  const expenses = transactions.filter((t) => t.type === "expense");

  // Data for category pie chart
  const categoryData = expenses.reduce((acc, transaction) => {
    const category = transaction.category || "other";
    const existing = acc.find((item) => item.category === category);
    if (existing) {
      existing.amount += Number(transaction.amount);
    } else {
      acc.push({ category, amount: Number(transaction.amount) });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  // Data for monthly trend chart
  const monthlyData = expenses.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const existing = acc.find((item) => item.month === monthKey);
    if (existing) {
      existing.amount += Number(transaction.amount);
    } else {
      acc.push({
        month: monthKey,
        amount: Number(transaction.amount),
        monthName: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      });
    }
    return acc;
  }, [] as { month: string; amount: number; monthName: string }[]).sort((a, b) => a.month.localeCompare(b.month));

  // Data for daily spending (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const dailyData = last30Days.map((date) => {
    const dayExpenses = expenses.filter((t) => t.date.split("T")[0] === date);
    const total = dayExpenses.reduce((sum, t) => sum + Number(t.amount), 0);
    return {
      date,
      amount: total,
      day: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  const totalSpent = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  if (loading) {
    return (
      <ProtectedRoute>
        <>
          <ChatBot />
          <div style={{
            minHeight: "100vh",
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial, sans-serif"
          }}>
            <div style={{ textAlign: "center", color: "#666" }}>
              Loading charts...
            </div>
          </div>
        </>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <>
        <ChatBot />
        <div style={{
          minHeight: "100vh",
          background: "#f5f5f5",
          fontFamily: "Arial, sans-serif"
        }}>
        <div style={{
          maxWidth: "1200px",
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
                Spending Analytics
              </h1>
              <p style={{
                fontSize: "1rem",
                color: "#333",
                marginBottom: "1rem"
              }}>
                Total Spent: ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

          {expenses.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "4rem",
              color: "#666",
              background: "#f9fafb",
              borderRadius: "4px"
            }}>
              <h3>No expenses to analyze</h3>
              <p>Add some expenses to see your spending charts</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "2rem" }}>
              {/* Category Distribution Pie Chart */}
              <div style={{
                background: "#f9fafb",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb"
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#333",
                  textAlign: "center"
                }}>
                  Spending by Category
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Amount"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trend Line Chart */}
              <div style={{
                background: "#f9fafb",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb"
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#333",
                  textAlign: "center"
                }}>
                  Monthly Spending Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Amount"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Spending Bar Chart */}
              <div style={{
                background: "#f9fafb",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb"
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#333",
                  textAlign: "center"
                }}>
                  Daily Spending (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Amount"]}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
      </>
    </ProtectedRoute>
  );
}

export default SpendingCharts;
