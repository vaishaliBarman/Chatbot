let responses = {};

// Load responses from Moodle.json
fetch('Moodle.json')
  .then(response => response.json())
  .then(data => {
    responses = data;
    console.log("Responses loaded:", responses);
  })
  .catch(error => {
    console.error("Error loading Moodle.json:", error);
    appendMessage("Answer: डेटा लोड करने में समस्या आ गई।", 'bot');
  });

const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');

// Append message to chat
function appendMessage(text, sender) {
  const msgWrapper = document.createElement('div');
  msgWrapper.className = 'message-wrapper ' + sender;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.innerHTML = sender === 'user' ? '🧑' : '🤖';

  const msg = document.createElement('div');
  msg.className = 'message';
  msg.textContent = text;

  msgWrapper.appendChild(avatar);
  msgWrapper.appendChild(msg);

  chatbox.appendChild(msgWrapper);
  msgWrapper.classList.add('slide-in');
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Calculate similarity between two strings (0 to 1)
function getSimilarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  let matches = 0;
  let len = Math.max(a.length, b.length);

  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++;
  }

  return matches / len;
}

// Process user input and respond
function sendMessage() {
  let input = userInput.value.trim().toLowerCase();
  if (!input) return;

  appendMessage("आप: " + userInput.value, 'user');

  let found = false;

  // Exact match
  if (input in responses) {
    appendMessage("Answer: " + responses[input], 'bot');
    found = true;
  } else {
    // Fuzzy matching
    let bestMatch = '';
    let highestScore = 0;

    for (let key in responses) {
      let score = getSimilarity(input, key.toLowerCase());
      if (score > highestScore) {
        highestScore = score;
        bestMatch = key;
      }
    }

    if (highestScore >= 0.45) {
      appendMessage("Answer: " + responses[bestMatch], 'bot');
      found = true;
    }
  }

  if (!found) {
    appendMessage("Answer: माफ़ कीजिए, मैं समझ नहीं पाया।", 'bot');
  }

  userInput.value = '';
  userInput.focus();
}

// Handle Enter key
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
