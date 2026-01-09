import express from "express";
import Transaction from "../models/Transaction.js";
import OpenAI from "openai";
import auth from "../middleware/auth.js";

const router = express.Router();

let client = null;

if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️  OPENAI_API_KEY NOT LOADED - AI features will be disabled");
} else {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

router.post("/ask", auth, async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (!client) {
      return res.json({ 
        answer: "AI features are currently disabled. Please configure OPENAI_API_KEY in the server environment to enable AI assistance." 
      });
    }

    const txns = await Transaction.find({ userId: req.user });
    const prompt = `My transactions: ${JSON.stringify(txns)}. Question: ${question}`;
    
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("AI request error:", error);
    res.status(500).json({ message: "Failed to process AI request" });
  }
});

export default router;
