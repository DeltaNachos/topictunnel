const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const timerForm = document.getElementById('timerForm');

// Save settings on submit
timerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const workDuration = parseInt(document.getElementById('work').value);
  const breakDuration = parseInt(document.getElementById('break').value);
  
  await chrome.storage.local.set({
    pomodoroWork: workDuration * 60, // Convert minutes to seconds
    pomodoroBreak: breakDuration * 60, // Convert minutes to seconds
  });
});

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

stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage('stopTimer');
});