const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function fetchCareerAdvice(userText) {
    try {
        // Fetching from localhost:3000 and /get-advice route
        const response = await fetch('http://localhost:3000/get-advice', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userText }), 
        });

        if (!response.ok) throw new Error('Server issues');

        const data = await response.json();
        return data.advice; // Backend se 'advice' key aa rahi hai
    } catch (error) {
        console.error("Error:", error);
        return "Connection failed. Please check if the CMD terminal is still running.";
    }
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot');
    loadingDiv.innerText = "Consulting the career maps...";
    chatWindow.appendChild(loadingDiv);

    const advice = await fetchCareerAdvice(text);
    
    loadingDiv.innerText = advice;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});