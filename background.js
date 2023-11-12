// start the pomodoro timer
let workingTimer;
let breakTimer;
let working = false;
let topic;
let kill = false;

// get tab title on change
var activeTabTitle;
var lastTabTitle;
var gptTabTitle;
var lastUrl;
let gptResponse;
var reloaded = false;

// Function to get the title of the active tab
function getActiveTabTitle() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        const activeTabId = tabs[0].id;
        chrome.tabs.get(activeTabId, function(tab) {
          activeTabTitle = tab.title;
          if (activeTabTitle === lastTabTitle) {return;}
          if (tab.url === lastUrl || tab.url.includes("chrome")) {return;}
          lastTabTitle = activeTabTitle;
          lastUrl = tab.url;
          //fetcher();
          // You can use activeTabTitle for your operations
        });
      }
    });
  }

  // start the timer when the button runs then remove that listener to prevent conflicts
  chrome.runtime.onMessage.addListener(startTimer);

  const startTimer = (message, sender, sendResponse) => {
    if (message.message === 'startTimer' && working === false) {
      topic = message.topic;
      working = true;
      sendResponse( { message : 'timerStarted' } )
      chrome.runtime.onMessage.removeListener(startTimer);
    } else if (message.message === 'kill' && working === true) {
      kill = true;
    }
  }

  // Event listener for tab activation changes
  chrome.tabs.onActivated.addListener(changeTab);

  const changeTab = function(activeInfo) {
    if (kill) {
      return;
    }
    chrome.tabs.reload();
    getActiveTabTitle();
     // Retrieve the title whenever the active tab changes
  }

  // Event listener for tab name changes
  chrome.tabs.onUpdated.addListener(updateTab);

  const updateTab = function(activeInfo) {
    if (kill) {
      return;
    }
    getActiveTabTitle();
    // Retrieve the title whenever a tab changes its name
  }

// HTTP POST to cloud compute
function fetcher() {
  if (topic === undefined || topic === "" || activeTabTitle === undefined || activeTabTitle === "") {return;}
  if (activeTabTitle === gptTabTitle) {return;}
  gptTabTitle = activeTabTitle;
  reloaded = false;
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
        gptResponse = output
        console.log(output)
        console.log(activeTabTitle)
        if (output === 'upstream request timeout') fetcher();
      }
    )
    .catch(err => console.log(err))
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (kill) {
    return;
  }
  if (request.message === "contentLoad") {
    fetcher();
    sendResponse({message: gptResponse});
    if (reloaded === false) {
      setTimeout(chrome.tabs.reload(), 2000)
      reloaded = true;
    }
  }
});