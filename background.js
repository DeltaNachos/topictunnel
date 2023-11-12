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
          if (activeTabTitle == lastTabTitle) {return;}
          lastTabTitle = activeTabTitle;
          fetcher();
          //console.log(activeTabTitle);
          //return activeTabTitle;
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

  // Event listener for tab name changes
  chrome.tabs.onUpdated.addListener(function(activeInfo) {
    getActiveTabTitle();
    // Retrieve the title whenever a tab changes its name
  });

// HTTP POST to cloud compute
function fetcher() {
  fetch("https://us-central1-topictunnel.cloudfunctions.net/http-test", {
    method: "POST",
    body: JSON.stringify({
      "prompt": "fortnite",
      "text": activeTabTitle
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(output => output.text())
    .then((output) => {
      console.log(output)
      console.log(activeTabTitle)
    })
    .catch(err => console.log(err));
}