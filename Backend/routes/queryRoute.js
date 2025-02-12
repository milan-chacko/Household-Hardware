import express from 'express';
import Query from '../models/query.model.js';

const queryRouter = express.Router();

// 📌 Save a new query
queryRouter.post("/submit", async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required" });
    }

    const newQuery = new Query({ email, message });
    await newQuery.save();

    res.status(201).json({ message: "Query submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving query" });
  }
});

// 📌 Get previous queries by email
queryRouter.get("/queries", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const queries = await Query.find({ email }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching queries" });
  }
});

queryRouter.get("/pending", async (req, res) => {
  try {
    const queries = await Query.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending queries" });
  }
});

queryRouter.get("/answered", async (req, res) => {
  try {
    const queries = await Query.find({ status: "answered" }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch answered queries" });
  }
});

// Reply to a query (for admin)
queryRouter.put("/reply/:id", async (req, res) => {
  try {
    const { reply } = req.body;
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { reply, status: "answered" }, // Update status to "answered"
      { new: true }
    );

    res.json(query);
  } catch (error) {
    res.status(500).json({ error: "Failed to update query" });
  }
});

export default queryRouter;
