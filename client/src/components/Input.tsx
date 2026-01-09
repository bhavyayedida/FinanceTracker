import React from "react";
import styles from "./Input.module.css";
import { cn } from "../utils/helpers";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  if (label) {
    return (
      <div className={styles.inputWrapper}>
        <label className={styles.label}>{label}</label>
        <input className={cn(styles.input, className)} {...props} />
      </div>
    );
  }

  return <input className={cn(styles.input, className)} {...props} />;
}
