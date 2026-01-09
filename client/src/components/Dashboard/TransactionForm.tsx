import React from "react";
import { CATEGORY_OPTIONS, TRANSACTION_TYPE_OPTIONS } from "../../utils/constants";
import styles from "../../pages/Dashboard.module.css";

interface TransactionFormProps {
  title: string;
  amount: string;
  date: string;
  category: string;
  type: "income" | "expense";
  onTitleChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: "income" | "expense") => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  title,
  amount,
  date,
  category,
  type,
  onTitleChange,
  onAmountChange,
  onDateChange,
  onCategoryChange,
  onTypeChange,
  onSubmit,
}) => {
  return (
    <div className={styles.formSection}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGrid}>
          <input
            type="text"
            placeholder="Description"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            required
            min="0"
            step="0.01"
            className={styles.input}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            required
            className={styles.input}
          />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={styles.select}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as "income" | "expense")}
            className={styles.select}
          >
            {TRANSACTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.submitButton}>
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

