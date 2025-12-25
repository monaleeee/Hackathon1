const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors(), express.json());

// FIXED: This line ensures Vercel can find your index.html and other files
app.use(express.static(path.join(__dirname)));

app.post('/get-advice', async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

        console.log("Terminal: Attempting call with Gemini 2.5 Flash-Lite...");

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }]}],
            generationConfig: { 
                temperature: 0.9, 
                maxOutputTokens: 2048 
            }
        });

        const aiText = response.data.candidates[0].content.parts[0].text;
        console.log("Terminal: SUCCESS! AI is working.");
        res.json({ advice: aiText });

    } catch (error) {
        console.error("--- ERROR ---");
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).json({ error: "AI is currently overloaded. Please try again in 60s." });
    }
});

// IMPORTANT: Vercel needs to handle the routing to your homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel does not use app.listen, so we only run it if we are local
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('Server LIVE on 3000 | Using Gemini 2.5'));
}

// THIS IS THE MOST IMPORTANT LINE FOR VERCEL
module.exports = app;
