import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: String,
  title: String,
  amount: Number,
  type: { type: String, enum: ["income", "expense"] },
  category: { type: String, enum: ["food", "entertainment", "travel", "fees", "emi", "other"] },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", TransactionSchema);
