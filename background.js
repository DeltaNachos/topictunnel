let timerInterval;
let timeLeft;
let isRunning = false;

async function init() {
  const [workDuration, breakDuration] = await Promise.all([
    chrome.storage.local.get(['pomodoroWork']),
    chrome.storage.local.get(['pomodoroBreak'])
  ]);

  timeLeft = workDuration.pomodoroWork || 1500; // Default to 25 minutes
}

function tick() {
  timeLeft -= 1;
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, 'done');
      });
    });
  } else {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, 'tick');
      });
    });
  }
}

chrome.runtime.onMessage.addListener((message) => {
  switch (message) {
    case 'startTimer':
      if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(tick, 1000);
      }
      break;
    case 'stopTimer':
      if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
      }
      break;
  }
});

init();