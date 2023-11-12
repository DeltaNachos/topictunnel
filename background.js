// start the pomodoro timer
let workingTimer;
let breakTimer;
let working = false;
let topic;
let kill = false;

// get tab title on change
var activeTabTitle;
var lastTabTitle;
var lastUrl;
let gptResponse;

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

  chrome.runtime.onMessage.addListener(startTimer); // start the timer when the button runs then remove that listener to prevent conflicts

  const changeTab = function(activeInfo) {
    if (kill) {
      return;
    }
    chrome.tabs.reload();
    getActiveTabTitle();
     // Retrieve the title whenever the active tab changes
  }

  // Event listener for tab activation changes
  chrome.tabs.onActivated.addListener(changeTab);

  const updateTab = function(activeInfo) {
    if (kill) {
      return;
    }
    getActiveTabTitle();
    // Retrieve the title whenever a tab changes its name
  }

  // Event listener for tab name changes
  chrome.tabs.onUpdated.addListener(updateTab);

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
        gptResponse = output
        console.log(output)
        console.log(activeTabTitle)
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
    // temp remove listener
    // chrome.runtime.onUpdated.removeListener(updateTab);
    // reload
    chrome.tabs.reload();
    // re-add listener after 1 second
    setTimeout(() => {
      chrome.tabs.onUpdated.addListener(updateTab);
    }, 1000);
  }
});