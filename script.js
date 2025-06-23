
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");
const toggleTheme = document.getElementById("toggle-theme");

// --- Helper: Similarity Function (Basic Fuzzy Matching) ---
function getSimilarity(str1, str2) {
  str1 = str1.toLowerCase().trim();
  str2 = str2.toLowerCase().trim();
  
  let matches = 0;
  const minLen = Math.min(str1.length, str2.length);

  for (let i = 0; i < minLen; i++) {
    if (str1[i] === str2[i]) matches++;
  }

  return matches / Math.max(str1.length, str2.length);
}

// --- Get chatbot response with fuzzy matching ---
async function getBotResponse(input) {
  const res = await fetch("Moodle.json");
  const data = await res.json();

  // Exact match check
  if (data[input.trim()]) {
    return data[input.trim()];
  }

  // Fuzzy match check
  let bestMatch = "";
  let highestScore = 0;

  for (let key in data) {
    const score = getSimilarity(input, key);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = key;
    }
  }

  // Threshold of 0.3 = 30% match
  if (highestScore >= 0.3) {
    return data[bestMatch];
  }

  return "माफ़ कीजिए, मैं वह नहीं समझ पाया।";
}

// --- Append message to chat window ---
function appendMessage(content, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// --- Send button click handler ---
sendBtn.addEventListener("click", async () => {
  const input = userInput.value.trim();
  if (!input) return;
  appendMessage(input, "user");
  userInput.value = "";
  const botReply = await getBotResponse(input);
  setTimeout(() => appendMessage(botReply, "bot"), 500);
});

// --- Speech recognition (Hindi) ---
micBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "hi-IN";
  recognition.start();
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
  };
});

// --- Theme Toggle Button ---
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// --- Emoji Bubbles Background ---
const bubbleContainer = document.getElementById("bubble-background");
const emojis = ["💬", "🤖", "🧠", "💡", "✨", "👋", "+", "*"];

function createBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const size = Math.random() * 1.5 + 1;
  bubble.style.fontSize = `${size}rem`;
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.animationDuration = `${5 + Math.random() * 10}s`;

  bubbleContainer.appendChild(bubble);
  setTimeout(() => {
    bubble.remove();
  }, 15000);
}

setInterval(createBubble, 1000);
