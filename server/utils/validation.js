export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateTransaction = (data) => {
  const { title, amount, type, category } = data;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    errors.push("Valid amount is required");
  }

  if (!type || !["income", "expense"].includes(type)) {
    errors.push("Type must be 'income' or 'expense'");
  }

  if (category && !["food", "entertainment", "travel", "fees", "emi", "other"].includes(category)) {
    errors.push("Invalid category");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

