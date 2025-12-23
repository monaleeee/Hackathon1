const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(cors(), express.json());

app.post('/get-advice', async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

        console.log("Terminal: Attempting call with Gemini 2.5 Flash-Lite...");

        // MODEL: gemini-2.5-flash-lite (The only high-limit free model right now)
        // ENDPOINT: v1beta (Required for 2.5 models)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }],
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
        // This will print the exact reason if it still fails
        console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).json({ error: "AI is currently overloaded. Please try 1.5 Flash or wait 60s." });
    }
});

app.listen(3000, () => console.log('Server LIVE on 3000 | Using Gemini 2.5'));