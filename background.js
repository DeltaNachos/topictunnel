let timerInterval; // tick length
let timeLeft; // time left on work or break timer
let isRunning = false; // is the timer running

async function init() { // start the timer
    let i = 0;
    while (i < 3) { // traditional pomodoros run 4 times
        const [workDuration, breakDuration] = await Promise.all([
        chrome.storage.local.get(['pomodoroWork']),
        chrome.storage.local.get(['pomodoroBreak'])
        ]); // gets current timer settings from options

        timeLeft = workDuration.pomodoroWork || 1500; // Default to 25 minutes
        setTimeout(() => {
            timeLeft = breakDuration.pomodoroBreak || 300; // Default to 5 minutes
        }, timeLeft * 1000);
        i++; 
    }
}

function tick() {
  timeLeft -= 1; // decrease time by 1 sec
  if (timeLeft <= 0) { // timer expires
    clearInterval(timerInterval);
    chrome.tabs.query({}, (tabs) => { // gets every tab
      tabs.forEach((tab) => {
        chrome.runtime.sendMessage({ message: "done" }); // timer is done
      });
    });
  } else {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.runtime.sendMessage({ message: "tick" }); // timer counts down 1
      });
    });
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message == 'startTimer') { // trigger to start
    if (!isRunning) {
        isRunning = true; // timer starts
        timerInterval = setInterval(tick, 1000); // define tick as 1 second
    }
  }
});

init(); 

// get tab title on change

var activeTabTitle;

// Function to get the title of the active tab
function getActiveTabTitle() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        const activeTabId = tabs[0].id;
        chrome.tabs.get(activeTabId, function(tab) {
          activeTabTitle = tab.title;
          // You can use activeTabTitle for your operations
        });
      }
    });
  }
  
  // Event listener for tab activation changes
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    getActiveTabTitle(); // Retrieve the title whenever the active tab changes
  });