// start the pomodoro timer
async function init() {
    
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

  chrome.runtime.onMessage.addListener((message) => {
    console.log(message.message);
  })