export const API_BASE_URL = "http://localhost:5000";

export const ROUTES = {
  LOGIN: "/",
  DASHBOARD: "/dashboard",
  ASK_AI: "/ask",
  SPENDING_CHARTS: "/spending-charts",
} as const;

export const STORAGE_KEYS = {
  TOKEN: "token",
} as const;

export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export const TRANSACTION_CATEGORIES = {
  FOOD: "food",
  ENTERTAINMENT: "entertainment",
  TRAVEL: "travel",
  FEES: "fees",
  EMI: "emi",
  OTHER: "other",
} as const;

export const CATEGORY_OPTIONS = [
  { value: TRANSACTION_CATEGORIES.FOOD, label: "Food" },
  { value: TRANSACTION_CATEGORIES.ENTERTAINMENT, label: "Entertainment" },
  { value: TRANSACTION_CATEGORIES.TRAVEL, label: "Travel" },
  { value: TRANSACTION_CATEGORIES.FEES, label: "Fees" },
  { value: TRANSACTION_CATEGORIES.EMI, label: "EMI" },
  { value: TRANSACTION_CATEGORIES.OTHER, label: "Other" },
] as const;

export const TRANSACTION_TYPE_OPTIONS = [
  { value: TRANSACTION_TYPES.INCOME, label: "Income" },
  { value: TRANSACTION_TYPES.EXPENSE, label: "Expense" },
] as const;
