import dotenv from "dotenv";
import express from "express";
import axios from "axios";

dotenv.config();
const aiRoute = express.Router();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

const sessions = {}; // Store chat history temporarily

aiRoute.post("/chat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        if (!message || !userId) {
            return res.status(400).json({ error: "Message and userId are required" });
        }

        if (!sessions[userId]) {
            sessions[userId] = [];
        }

        sessions[userId].push({ role: "user", text: message });

        const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
            contents: [{ parts: [{ text: message }] }]
        });

        const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        sessions[userId].push({ role: "ai", text: aiResponse });

        // Limit chat history to avoid memory overflow
        if (sessions[userId].length > 20) {
            sessions[userId].shift();
        }

        res.json({ response: aiResponse, history: sessions[userId] });

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get response from Gemini" });
    }
});

export default aiRoute;