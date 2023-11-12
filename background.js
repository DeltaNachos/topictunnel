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
  