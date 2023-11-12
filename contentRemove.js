console.log('content script');
chrome.runtime.sendMessage({message: "contentLoad"}, (response) => {
  if(response.message === "NO") {
    console.log("nuh uh");
    document.body.innerHTML = "<h1>STAY FOCUSED!</h1> <img src='https://media.tenor.com/_tHxkI_ur48AAAAC/nuh-uh-nuh.gif' alt='nuh uh'/>";
  }
  console.log(response.message);
});