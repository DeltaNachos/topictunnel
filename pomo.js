const startBtn = document.getElementById('start-button');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'tick') {
    console.log('Tick...');
  } else if (request === 'done') {
    console.log('Time up! Take a break.');
  }
});

// Send message to background script to start/stop timer
startBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage('startTimer');
});