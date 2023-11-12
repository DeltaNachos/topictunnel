const start = document.getElementById('start-button');
let topic = document.getElementById('researchTopic').value;

start.addEventListener('click', () => {
  console.log(topic);
  chrome.runtime.sendMessage( { message: "startTimer", topic: topic }, (response) => {
    console.log(response.message);
  } )
})