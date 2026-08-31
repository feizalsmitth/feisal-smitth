var phrases = ["Frontend Developer", "React & TypeScript", "Also a Barista", "Nairobi, Kenya", "Available October"];
var typedEl = document.getElementById('typed');
var pi = 0, ci = 0, deleting = false;

function tick(){
  var current = phrases[pi];
  if(!deleting){
    ci++;
    if(ci > current.length){ deleting = true; setTimeout(tick, 1400); return; }
  } else {
    ci--;
    if(ci === 0){ deleting = false; pi = (pi + 1) % phrases.length; }
  }
  typedEl.innerHTML = '<span style="color:var(--ink-bright)">&gt; ' + current.slice(0, ci) + '</span><span class="cursor"></span>';
  setTimeout(tick, deleting ? 40 : 80);
}
tick();

var links = document.querySelectorAll('.side-nav a');
var sections = Array.from(links).map(function(a){ return document.querySelector(a.getAttribute('href')); });
function onScroll(){
  var pos = window.scrollY + 120;
  var activeIndex = 0;
  sections.forEach(function(sec, i){ if(sec && sec.offsetTop <= pos) activeIndex = i; });
  links.forEach(function(a, i){ a.classList.toggle('active', i === activeIndex); });
}
if('IntersectionObserver' in window){
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ---- Selected work: expand/collapse ---- */
var projectCards = Array.from(document.querySelectorAll('.project'));

function toggleProject(card){
  var isOpen = card.classList.contains('expanded');
  card.classList.toggle('expanded', !isOpen);
  card.setAttribute('aria-expanded', String(!isOpen));
}

projectCards.forEach(function(card){
  card.addEventListener('click', function(){ toggleProject(card); });
  card.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      toggleProject(card);
    }
  });
});

/* ---- Selected work: tag filtering ---- */
var filterBar = document.getElementById('filterBar');
var allTags = new Set();
projectCards.forEach(function(card){
  card.dataset.tags.split(',').forEach(function(t){ allTags.add(t.trim()); });
});

function makeFilterBtn(label, value, active){
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'filter-btn' + (active ? ' active' : '');
  btn.textContent = label;
  btn.dataset.filter = value;
  return btn;
}

filterBar.appendChild(makeFilterBtn('All', 'all', true));
Array.from(allTags).sort().forEach(function(tag){
  filterBar.appendChild(makeFilterBtn(tag, tag, false));
});

filterBar.addEventListener('click', function(e){
  var btn = e.target.closest('.filter-btn');
  if(!btn) return;

  Array.from(filterBar.children).forEach(function(b){ b.classList.toggle('active', b === btn); });

  var filter = btn.dataset.filter;
  projectCards.forEach(function(card){
    var tags = card.dataset.tags.split(',').map(function(t){ return t.trim(); });
    var show = filter === 'all' || tags.indexOf(filter) !== -1;
    card.classList.toggle('is-hidden', !show);
    if(!show && card.classList.contains('expanded')){
      card.classList.remove('expanded');
      card.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ---- Theme Toggle ---- */
var themeToggle = document.getElementById('themeToggle');
var themeIcon = document.getElementById('themeIcon');
var isDark = true;

themeToggle.addEventListener('click', function() {
  isDark = !isDark;
  document.documentElement.classList.toggle('light-mode', !isDark);
  themeIcon.innerHTML = isDark
    ? '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'
    : '<path d="M12 18a6 6 0 0 0-9-9 9 9 0 1 0 9 9Z"/>';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.add('light-mode');
  isDark = false;
  themeIcon.innerHTML = '<path d="M12 18a6 6 0 0 0-9-9 9 9 0 1 0 9 9Z"/>';
}

/* ---- Booking form ---- */
var bookingForm = document.getElementById('bookingForm');
var bookingStatus = document.getElementById('bookingStatus');

bookingForm.addEventListener('submit', function(e){
  e.preventDefault();

  var name = document.getElementById('bk-name').value.trim();
  var email = document.getElementById('bk-email').value.trim();
  var type = document.getElementById('bk-type').value;
  var budget = document.getElementById('bk-budget').value;
  var date = document.getElementById('bk-date').value;
  var timeline = document.getElementById('bk-timeline').value.trim();
  var details = document.getElementById('bk-details').value.trim();

  var subject = 'Booking inquiry: ' + type + ' - ' + name;
  var bodyLines = [
    'Name: ' + name,
    'Email: ' + email,
    'Inquiry type: ' + type,
    'Budget range: ' + budget,
    'Preferred start / event date: ' + date,
    'Rough deadline: ' + (timeline || '-'),
    '',
    'Project details:',
    details
  ];
  var body = bodyLines.join('\n');

  var mailtoLink = 'mailto:feizalsmitth@icloud.com'
    + '?subject=' + encodeURIComponent(subject)
    + '&body=' + encodeURIComponent(body);

  bookingStatus.textContent = 'Opening your email client to send this request...';
  bookingStatus.classList.add('show');

  window.location.href = mailtoLink;
});

/* ============================================
   JARVIS AI Assistant
   ============================================ */

// Jarvis conversation state
let conversation = [
  { role: 'assistant', content: "Hello! I'm JARVIS, Feizal Onyango's AI assistant. How can I help you today?", time: new Date() },
  { role: 'assistant', content: "You can ask me about:\n- Feizal's projects and technologies\n- Booking a project or consultation\n- General knowledge questions (I'll search Google!)\n\n💡 Tip: Click the 🔊 button to hear my responses!", time: new Date() }
];

// DOM Elements
let jarvisMessages, jarvisInput, jarvisSendBtn, typingIndicator, jarvisSuggestions;
let voiceToggleBtn, voiceSettingsBtn, voiceModal, voiceOptions;
let apiSettingsBtn, apiModal, apiKeyInput, searchEngineIdInput, apiStatus;

// Voice settings
let voiceEnabled = true;
let selectedVoice = null;
let voices = [];

// API settings (stored in localStorage)
let apiConfig = {
  apiKey: localStorage.getItem('jarvisApiKey') || '',
  searchEngineId: localStorage.getItem('jarvisSearchEngineId') || ''
};

// Initialize JARVIS when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  jarvisMessages = document.getElementById('jarvisMessages');
  jarvisInput = document.getElementById('jarvisInput');
  jarvisSendBtn = document.getElementById('jarvisSendBtn');
  typingIndicator = document.getElementById('typingIndicator');
  jarvisSuggestions = document.getElementById('jarvisSuggestions');
  voiceToggleBtn = document.getElementById('voiceToggleBtn');
  voiceSettingsBtn = document.getElementById('voiceSettingsBtn');
  voiceModal = document.getElementById('voiceModal');
  voiceOptions = document.getElementById('voiceOptions');
  apiSettingsBtn = document.getElementById('apiSettingsBtn');
  apiModal = document.getElementById('apiModal');
  apiKeyInput = document.getElementById('apiKey');
  searchEngineIdInput = document.getElementById('searchEngineId');
  apiStatus = document.getElementById('apiStatus');

  // Initialize speech synthesis
  initSpeechSynthesis();
  
  // Load API config from localStorage
  apiConfig.apiKey = localStorage.getItem('jarvisApiKey') || '';
  apiConfig.searchEngineId = localStorage.getItem('jarvisSearchEngineId') || '';
  
  // Update API status
  updateApiStatus();
  
  // Initialize chat with stored conversation
  conversation.forEach(msg => {
    addMessage(msg.content, msg.role, msg.time, voiceEnabled);
  });
  
  // Set up event listeners
  if (voiceToggleBtn) voiceToggleBtn.onclick = toggleVoice;
  if (voiceSettingsBtn) voiceSettingsBtn.onclick = openVoiceModal;
  if (apiSettingsBtn) apiSettingsBtn.onclick = openApiModal;

  // Close modals when clicking outside
  if (voiceModal) {
    voiceModal.onclick = (e) => {
      if (e.target === voiceModal) closeVoiceModal();
    };
  }
  
  if (apiModal) {
    apiModal.onclick = (e) => {
      if (e.target === apiModal) closeApiModal();
    };
  }

  // Focus input after a short delay
  setTimeout(() => {
    if (jarvisInput) jarvisInput.focus();
  }, 100);
});

// Initialize speech synthesis
function initSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    let voicesLoaded = false;
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
    
    function loadVoices() {
      if (voicesLoaded) return;
      voicesLoaded = true;
      
      voices = speechSynthesis.getVoices();
      
      // Filter for English voices
      const englishVoices = voices.filter(voice => 
        voice.lang.startsWith('en')
      );
      
      // If no English voices, use all available
      if (englishVoices.length === 0) {
        englishVoices = voices;
      }
      
      // Populate voice options
      populateVoiceOptions(englishVoices);
      
      // Select a default voice (prefer a male English voice)
      const defaultVoice = englishVoices.find(v => 
        v.name.includes('Male') || 
        v.name.includes('Daniel') || 
        v.name.includes('David') ||
        v.name.includes('Google UK English Male')
      ) || englishVoices[0];
      
      if (defaultVoice) {
        selectedVoice = defaultVoice;
      }
    }
  } else {
    // Browser doesn't support speech synthesis
    if (voiceToggleBtn) {
      voiceToggleBtn.disabled = true;
      voiceToggleBtn.title = "Voice not supported in this browser";
    }
  }
}

// Populate voice options in modal
function populateVoiceOptions(voiceList) {
  if (!voiceOptions) return;
  
  voiceOptions.innerHTML = '';
  
  voiceList.forEach((voice, index) => {
    const option = document.createElement('label');
    option.className = 'voice-option';
    option.innerHTML = `
      <input type="radio" name="voice" value="${index}">
      <span class="voice-option-label">${voice.name} (${voice.lang})</span>
      <span class="voice-option-rate">${voice.default ? 'Default' : ''}</span>
    `;
    
    if (selectedVoice && selectedVoice.name === voice.name) {
      option.classList.add('selected');
      option.querySelector('input').checked = true;
    }
    
    option.onclick = () => {
      document.querySelectorAll('.voice-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedVoice = voice;
    };
    
    voiceOptions.appendChild(option);
  });
}

// Function to add a message to the chat
function addMessage(content, role, time = new Date(), speak = false, isSearchResult = false) {
  if (!jarvisMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  if (role === 'user') {
    messageDiv.innerHTML = `
      <div class="message-avatar user">F</div>
      <div class="message-content">
        <div class="message-bubble">${escapeHtml(content)}</div>
        <span class="message-time">${timeStr}</span>
      </div>
    `;
  } else if (isSearchResult) {
    messageDiv.innerHTML = `
      <div class="message-avatar jarvis">J</div>
      <div class="message-content">
        <div class="message-bubble">
          <div class="search-results">
            <h4>🔍 Google Search Results</h4>
            ${content}
          </div>
        </div>
        <button class="message-voice-btn" onclick="speakMessage(this)" title="Read aloud">🔊</button>
        <span class="message-time">${timeStr}</span>
      </div>
    `;
  } else {
    const voiceBtn = speak ? '<button class="message-voice-btn" onclick="speakMessage(this)" title="Read aloud">🔊</button>' : '';
    messageDiv.innerHTML = `
      <div class="message-avatar jarvis">J</div>
      <div class="message-content">
        <div class="message-bubble">${formatResponse(content)}</div>
        ${voiceBtn}
        <span class="message-time">${timeStr}</span>
      </div>
    `;
  }

  jarvisMessages.appendChild(messageDiv);
  jarvisMessages.scrollTop = jarvisMessages.scrollHeight;
}

// Function to speak a message
function speakMessage(button) {
  if (!voiceEnabled || !('speechSynthesis' in window)) return;
  
  const messageBubble = button.previousElementSibling;
  let text = messageBubble.textContent || messageBubble.innerText;
  
  // Clean up text (remove extra whitespace, etc.)
  text = text.trim().replace(/\s+/g, ' ');
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice if available
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  // Configure voice settings
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  // Speak
  speechSynthesis.speak(utterance);
  
  // Visual feedback
  button.style.opacity = '0.5';
  utterance.onend = () => {
    button.style.opacity = '1';
  };
}

// Function to toggle voice on/off
function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  if (voiceToggleBtn) {
    voiceToggleBtn.classList.toggle('active', voiceEnabled);
    voiceToggleBtn.title = voiceEnabled ? "Voice On - Click to disable" : "Voice Off - Click to enable";
  }
}

// Function to open voice settings
function openVoiceModal() {
  if (!('speechSynthesis' in window)) {
    alert("Voice synthesis is not supported in your browser.");
    return;
  }
  
  if (voiceModal) voiceModal.classList.add('active');
  populateVoiceOptions(voices.filter(v => v.lang.startsWith('en')));
}

// Function to close voice modal
function closeVoiceModal() {
  if (voiceModal) voiceModal.classList.remove('active');
}

// Function to save voice settings
function saveVoiceSettings() {
  const selectedOption = document.querySelector('.voice-option.selected');
  if (selectedOption) {
    const input = selectedOption.querySelector('input');
    if (input && input.checked) {
      const index = parseInt(input.value);
      if (voices[index]) {
        selectedVoice = voices[index];
      }
    }
  }
  closeVoiceModal();
}

// Function to open API modal
function openApiModal() {
  if (apiKeyInput && searchEngineIdInput) {
    apiKeyInput.value = apiConfig.apiKey;
    searchEngineIdInput.value = apiConfig.searchEngineId;
  }
  updateApiStatus();
  if (apiModal) apiModal.classList.add('active');
}

// Function to close API modal
function closeApiModal() {
  if (apiModal) apiModal.classList.remove('active');
}

// Function to save API settings
function saveApiSettings() {
  if (apiKeyInput && searchEngineIdInput) {
    apiConfig.apiKey = apiKeyInput.value.trim();
    apiConfig.searchEngineId = searchEngineIdInput.value.trim();
    
    // Save to localStorage
    localStorage.setItem('jarvisApiKey', apiConfig.apiKey);
    localStorage.setItem('jarvisSearchEngineId', apiConfig.searchEngineId);
    
    updateApiStatus();
  }
  closeApiModal();
  
  // Test the API
  if (apiConfig.apiKey && apiConfig.searchEngineId) {
    testGoogleSearch();
  }
}

// Function to update API status
function updateApiStatus() {
  if (!apiStatus) return;
  
  if (apiConfig.apiKey && apiConfig.searchEngineId) {
    apiStatus.textContent = '✅ Google Search is connected';
    apiStatus.classList.add('connected');
  } else {
    apiStatus.textContent = '⚠️ Google Search is not configured';
    apiStatus.classList.remove('connected');
  }
}

// Function to test Google Search API
async function testGoogleSearch() {
  if (!apiConfig.apiKey || !apiConfig.searchEngineId) return;
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiConfig.apiKey}&cx=${apiConfig.searchEngineId}&q=test`
    );
    
    if (response.ok) {
      addMessage("✅ Google Search API is working! You can now ask me to search the web.", 'assistant', new Date(), voiceEnabled);
    } else {
      addMessage("❌ Google Search API test failed. Please check your API key and Search Engine ID.", 'assistant', new Date(), voiceEnabled);
    }
  } catch (error) {
    addMessage("❌ Error testing Google Search API: " + error.message, 'assistant', new Date(), voiceEnabled);
  }
}

// Function to perform Google search
async function googleSearch(query) {
  if (!apiConfig.apiKey || !apiConfig.searchEngineId) {
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiConfig.apiKey}&cx=${apiConfig.searchEngineId}&q=${encodeURIComponent(query)}&num=3`
    );
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Google Search Error:', error);
    return null;
  }
}

// Function to format search results
function formatSearchResults(results) {
  if (!results || results.length === 0) {
    return '<p>No results found.</p>';
  }

  let html = '';
  results.forEach((result, index) => {
    html += `
      <div class="search-result-item">
        <a href="${result.link}" target="_blank">
          <div class="search-result-title">${escapeHtml(result.title)}</div>
          <div class="search-result-url">${escapeHtml(result.displayLink)}</div>
        </a>
        ${result.snippet ? `<div class="search-result-snippet">${escapeHtml(result.snippet)}</div>` : ''}
      </div>
    `;
  });
  
  return html;
}

// Function to format response (handle line breaks, lists, etc.)
function formatResponse(text) {
  // Replace newlines with <br>
  let formatted = text.replace(/\n/g, '<br>');
  
  // Handle lists
  formatted = formatted.replace(/\n- /g, '<br>• ');
  formatted = formatted.replace(/\n• /g, '<br>• ');
  
  // Handle bullet points
  formatted = formatted.replace(/\n\s*•/g, '<br>• ');
  
  return formatted;
}

// Function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Function to show typing indicator
function showTyping() {
  if (typingIndicator) {
    typingIndicator.style.display = 'flex';
    if (jarvisMessages) jarvisMessages.scrollTop = jarvisMessages.scrollHeight;
  }
}

// Function to hide typing indicator
function hideTyping() {
  if (typingIndicator) typingIndicator.style.display = 'none';
}

// Function to show suggestions
function showSuggestions() {
  if (jarvisSuggestions) jarvisSuggestions.style.display = 'flex';
}

// Function to hide suggestions
function hideSuggestions() {
  if (jarvisSuggestions) jarvisSuggestions.style.display = 'none';
}

// Function to detect search intent
function isSearchQuery(message) {
  const lowerMessage = message.toLowerCase();
  const searchKeywords = [
    'search', 'google', 'find', 'look up', 'what is', 'who is', 
    'how to', 'tutorial', 'example', 'latest', 'news', 'information',
    'tell me about', 'explain', 'define', 'meaning'
  ];
  
  return searchKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Function to send a message
async function sendJarvisMessage() {
  if (!jarvisInput || !jarvisSendBtn) return;
  
  const message = jarvisInput.value.trim();
  if (message === '') return;

  // Add user message
  addMessage(message, 'user');
  jarvisInput.value = '';
  hideSuggestions();

  // Show typing indicator
  showTyping();

  // Disable send button
  jarvisSendBtn.disabled = true;

  // Check if this is a search query
  const shouldSearch = isSearchQuery(message) && apiConfig.apiKey && apiConfig.searchEngineId;
  
  // Simulate response after a delay
  setTimeout(async () => {
    hideTyping();
    jarvisSendBtn.disabled = false;

    let response;
    
    if (shouldSearch) {
      // Perform Google search
      const results = await googleSearch(message);
      
      if (results && results.length > 0) {
        const resultsHtml = formatSearchResults(results);
        addMessage(resultsHtml, 'assistant', new Date(), voiceEnabled, true);
        
        // Also add a text response
        response = `I found ${results.length} results for "${message}". Here are the top matches:`;
        addMessage(response, 'assistant', new Date(), voiceEnabled);
      } else {
        response = "I couldn't find any results for that query. Would you like me to try a different search?";
        addMessage(response, 'assistant', new Date(), voiceEnabled);
      }
    } else {
      // Generate regular response
      response = generateResponse(message);
      addMessage(response, 'assistant', new Date(), voiceEnabled);

      // Speak the response if voice is enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        setTimeout(() => {
          const messages = document.querySelectorAll('.message.jarvis:last-child .message-voice-btn');
          if (messages.length > 0) {
            messages[messages.length - 1].click();
          }
        }, 100);
      }
    }

    // Show suggestions for follow-up
    setTimeout(showSuggestions, 500);
  }, 1000);
}

// Function to generate a response
function generateResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for exact matches
  const responses = {
    'hello': "Hello! I'm JARVIS, Feizal Onyango's AI assistant. How can I help you today?",
    'hi': "Hi there! I'm JARVIS. Ask me anything about Feizal's work or general knowledge.",
    'hey': "Hey! I'm JARVIS. What can I do for you today?",
    'tell me about feizal': "Feizal Onyango is a frontend developer based in Nairobi, Kenya. He specializes in building fast, accessible interfaces for studios and small businesses using React, Next.js, and clean CSS. He's also available for on-site barista service at events!",
    'what technologies does feizal use': "Feizal works with JavaScript (ES6+), TypeScript, HTML5, CSS3, React, Next.js, Node.js, Express, Redux, Tailwind CSS, Git, GitHub, Vercel, Netlify, PostgreSQL, Figma, and Shopify. He's also skilled in accessibility, performance optimization, SEO, and responsive design.",
    'how can i book a project': "You can book a project by filling out the booking form on this site. Feizal currently has availability for October. He typically replies within one business day to confirm a slot and next steps.",
    'what projects has feizal worked on': "Feizal has worked on several notable projects including Harrow & Finch studio site (Next.js, Sanity CMS), Loomstack inventory dashboard (React, Node, PostgreSQL), Ferro Coffee online storefront (Shopify), Public Notice nonprofit rebuild (HTML/CSS, Stripe), Nairobi Weather App (React, API), and KaaSoko Marketplace (Next.js, Shopify).",
    'what is your name': "I'm JARVIS - Just Another Radically Visionary Intelligent System. I'm Feizal Onyango's AI assistant, here to help you with anything related to his work or general knowledge.",
    'who created you': "I was created by Feizal Onyango, a talented frontend developer based in Nairobi, Kenya. He designed me to assist visitors like you with information about his projects and services.",
    'what can you do': "I can help you with project insights, answer questions about Feizal's work, search Google for real-time information, provide technical advice, draft messages, and more. Essentially, anything you need to know!",
    'thanks': "You're welcome! Feel free to ask if you have any other questions.",
    'thank you': "You're welcome! Feel free to ask if you have any other questions.",
    'bye': "Goodbye! Have a great day, and remember - Feizal Onyango is available for your next frontend project.",
    'goodbye': "Goodbye! Have a great day, and remember - Feizal Onyango is available for your next frontend project.",
    'contact': "You can contact Feizal at feizalsmitth@icloud.com or +254 702 478 201. He's based in Nairobi, Kenya and typically replies within one business day.",
    'email': "Feizal's email is feizalsmitth@icloud.com. You can also reach him at +254 702 478 201.",
    'phone': "Feizal's phone number is +254 702 478 201. You can also email him at feizalsmitth@icloud.com."
  };

  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  // Check for project-related queries
  if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
    return "Feizal has worked on several exciting projects! You can check out his selected work section for details, or ask me about a specific project.";
  }

  // Check for technology queries
  if (lowerMessage.includes('tech') || lowerMessage.includes('technology') || lowerMessage.includes('skills') || lowerMessage.includes('stack')) {
    return "Feizal is skilled in JavaScript, TypeScript, React, Next.js, Node.js, and more. He specializes in building fast, accessible interfaces with clean code.";
  }

  // Check for booking queries
  if (lowerMessage.includes('book') || lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('availability')) {
    return "Feizal is currently booking projects for October. You can use the booking form on this site, or contact him directly at feizalsmitth@icloud.com or +254 702 478 201.";
  }

  // Check for pricing queries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate') || lowerMessage.includes('budget')) {
    return "Feizal's project pricing varies based on scope and complexity. His booking form includes budget range options, and he's happy to discuss specific requirements.";
  }

  // Check for location queries
  if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('nairobi') || lowerMessage.includes('kenya')) {
    return "Feizal is based in Nairobi, Kenya. He works with clients locally and internationally, building accessible interfaces for studios and small businesses worldwide.";
  }

  // Default response
  return "I'm here to help! I can provide information about Feizal Onyango's work, search Google for answers, or assist with general questions. What would you like to know?";
}

// Function to handle suggestion clicks
function sendSuggestion(text) {
  if (jarvisInput) {
    jarvisInput.value = text;
    jarvisInput.focus();
    sendJarvisMessage();
  }
}

// Function to handle key down in input
function handleJarvisKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendJarvisMessage();
  }
}

// Make functions globally available for onclick handlers
window.speakMessage = speakMessage;
window.sendSuggestion = sendSuggestion;
window.handleJarvisKeyDown = handleJarvisKeyDown;
window.sendJarvisMessage = sendJarvisMessage;
window.toggleVoice = toggleVoice;
window.openVoiceModal = openVoiceModal;
window.closeVoiceModal = closeVoiceModal;
window.saveVoiceSettings = saveVoiceSettings;
window.openApiModal = openApiModal;
window.closeApiModal = closeApiModal;
window.saveApiSettings = saveApiSettings;
