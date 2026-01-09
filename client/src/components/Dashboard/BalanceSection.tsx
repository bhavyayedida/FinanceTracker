import React from "react";
import { formatCurrency } from "../../utils/formatters";
import styles from "../../pages/Dashboard.module.css";

interface BalanceSectionProps {
  balance: number;
  income: number;
  expense: number;
}

export const BalanceSection: React.FC<BalanceSectionProps> = ({
  balance,
  income,
  expense,
}) => {
  return (
    <div className={styles.balanceSection}>
      <div className={styles.balance}>
        Balance: {formatCurrency(balance)}
      </div>
      <div className={styles.incomeExpense}>
        <div>
          <span className={styles.income}>Income</span>
          <span className={styles.incomeAmount}>
            {formatCurrency(income)}
          </span>
        </div>
        <div>
          <span className={styles.expense}>Expense</span>
          <span className={styles.expenseAmount}>
            {formatCurrency(expense)}
          </span>
        </div>
      </div>
    </div>
  );
};

