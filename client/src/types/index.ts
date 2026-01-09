export interface User {
  _id: string;
  email: string;
  name?: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category?: "food" | "entertainment" | "travel" | "fees" | "emi" | "other";
  date: string;
}

export interface AuthResponse {
  token: string;
}

export interface AIResponse {
  answer: string;
}

