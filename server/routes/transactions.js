import express from "express";
import Transaction from "../models/Transaction.js";
import auth from "../middleware/auth.js";
import { validateTransaction } from "../utils/validation.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const txns = await Transaction.find({ userId: req.user }).sort({ date: -1 });
  res.json(txns);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    const validation = validateTransaction({ title, amount, type, category });
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.errors.join(", ") });
    }

  const txn = await Transaction.create({
      title: title.trim(),
      amount: Number(amount),
      type,
      category: category || "other",
      date: date || new Date(),
      userId: req.user,
  });

    res.status(201).json(txn);
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const txn = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user,
    });

    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

export default router;
