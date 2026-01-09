import React from "react";
import { Transaction } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import styles from "../../pages/Dashboard.module.css";

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  loading,
  onDelete,
}) => {
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (transactions.length === 0) {
    return <div className={styles.emptyState}>No transactions yet</div>;
  }

  return (
    <div>
      {transactions.map((t) => (
        <div key={t._id} className={styles.transactionCard}>
          <div className={styles.transactionInfo}>
            <div className={styles.transactionTitle}>
              <span className={styles.transactionName}>{t.title}</span>
              <span className={`${styles.transactionAmount} ${t.type === "income" ? styles.amountIncome : styles.amountExpense}`}>
                - {formatCurrency(Number(t.amount))}
              </span>
            </div>
            <div className={styles.transactionMeta}>
              <span>{formatDate(t.date)}</span>
              {t.category && (
                <span className={styles.categoryBadge}>
                  {t.category}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onDelete(t._id)}
            className={styles.removeButton}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

