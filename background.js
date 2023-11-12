// start the pomodoro timer
let workingTimer;
let breakTimer;
let timeInterval;
let working = false;
let topic;

async function init() {
    const [workTime, breakTime] = await Promise.all([
        chrome.storage.local.get(['pomodoroWork']),
        chrome.storage.local.get(['pomodoroBreak'])
    ]);

    workingTimer = workTime.pomodoroWork || 1500;
    breakTimer = breakTime.pomodoroBreak || 300;
}

function tick() {
    workingTimer -= 1;
    if (workingTimer <= 0) {
        clearInterval(timeInterval);
    } else {
        // send message to content script
    }
}

// get tab title on change
var activeTabTitle;

// Function to get the title of the active tab
function getActiveTabTitle() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        const activeTabId = tabs[0].id;
        chrome.tabs.get(activeTabId, function(tab) {
          activeTabTitle = tab.title;
          console.log(activeTabTitle)
          console.log(topic);
          return activeTabTitle;
          // You can use activeTabTitle for your operations
        });
      }
    });
  }
  
  // Event listener for tab activation changes
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    getActiveTabTitle();
     // Retrieve the title whenever the active tab changes
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message.message);
    console.log(message.topic);
    topic = message.topic;
    if (message.message == 'startTimer' && working == false) {
        topic = message.topic;
        working = true;
        timeInterval = setInterval(tick, 1000);
        sendResponse( { message : 'timerStarted' } )
    }
  }) // start the timer when the button runs