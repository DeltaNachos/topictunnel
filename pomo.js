const start = document.getElementById('start-button');

start.addEventListener('click', () => {
  chrome.runtime.sendMessage( { message: "startTimer" } )
})