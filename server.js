const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve ONLY public folder (important)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.post('/get-advice', async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API key missing" });
        }

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/` +
            `gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }]}],
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 2048
            }
        });

        const aiText =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text
            || "No response from AI";

        res.json({ advice: aiText });

    } catch (error) {
        console.error(
            "Gemini API Error:",
            error.response ? error.response.data : error.message
        );

        res.status(500).json({
            error: "AI is currently overloaded. Please try again in 60s."
        });
    }
});

// ✅ Always serve fr

