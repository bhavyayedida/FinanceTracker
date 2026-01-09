import { useState, useEffect } from "react";
import { api } from "../api";
import { Transaction } from "../types";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const addTransaction = async (data: {
    title: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string | Date;
  }) => {
    try {
      await api.post("/transactions", data);
      await loadTransactions();
      return { success: true };
    } catch (err) {
      console.error("Failed to add transaction", err);
      return { success: false, error: "Failed to add transaction" };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      await loadTransactions();
      return { success: true };
    } catch (err) {
      console.error("Failed to delete transaction", err);
      return { success: false, error: "Failed to delete transaction" };
    }
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  return {
    transactions,
    loading,
    error,
    income,
    expense,
    balance,
    addTransaction,
    deleteTransaction,
    reloadTransactions: loadTransactions,
  };
};

