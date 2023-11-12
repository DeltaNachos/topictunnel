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
var lastTabTitle;

// Function to get the title of the active tab
function getActiveTabTitle() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        const activeTabId = tabs[0].id;
        chrome.tabs.get(activeTabId, function(tab) {
          activeTabTitle = tab.title;
          if (activeTabTitle === lastTabTitle) {return;}
          lastTabTitle = activeTabTitle;
          fetcher();
          // console.log(activeTabTitle);
          // console.log(topic);
          // return activeTabTitle;
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

  const startTimer = (message, sender, sendResponse) => {
    if (message.message === 'startTimer' && working === false) {
      topic = message.topic;
      working = true;
      timeInterval = setInterval(tick, 1000);
      sendResponse( { message : 'timerStarted' } )
      chrome.runtime.onMessage.removeListener(startTimer);
    }
  }

  chrome.runtime.onMessage.addListener(startTimer); // start the timer when the button runs then remove that listener to prevent conflicts

  // Event listener for tab name changes
  chrome.tabs.onUpdated.addListener(function(activeInfo) {
    getActiveTabTitle();
    // Retrieve the title whenever a tab changes its name
  });

// HTTP POST to cloud compute
function fetcher() {
  if (topic === undefined || topic === "" || activeTabTitle === undefined || activeTabTitle === "") {return;}
  fetch("https://us-central1-topictunnel.cloudfunctions.net/http-test", {
    method: "POST",
    body: JSON.stringify({
      "prompt": topic,
      "text": activeTabTitle
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(output => output.text())
    .then((output) => {
      //chrome.runtime.onMessage.removeListener(startTimer);
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log(message.message);
        if (message.message === 'good?') {
          sendResponse( { message: output } );
        }
        console.log(output);
      })
      console.log(output)
      console.log(activeTabTitle)
    })
    .catch(err => console.log(err));
}
