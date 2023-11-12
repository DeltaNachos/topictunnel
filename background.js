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

// background.js (background script)

// Function to get the title of the active tab
function getActiveTabTitle() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        const activeTabId = tabs[0].id;
        chrome.tabs.get(activeTabId, function(tab) {
          const activeTabTitle = tab.title;
          // You can use activeTabTitle for your operations
        });
      }
    });
  }
  
  // Event listener for tab activation changes
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    getActiveTabTitle(); // Retrieve the title whenever the active tab changes
  });