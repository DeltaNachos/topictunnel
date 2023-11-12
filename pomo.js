const startBtn = document.getElementById('start-button');
const timerDisplay = document.getElementById('timerDisplay');

function updateTimerDisplay(minutes, seconds) {
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'tick') {
    // updateTimerDisplay(minutes, seconds);
    timerDisplay.textContent('4');
  } else if (request === 'done') {
    timerDisplay.textContent('Time up! Take a break.');
  }
});

// Send message to background script to start/stop timer
startBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ message: 'startTimer' });
});