const start = document.getElementById('start-button');

start.addEventListener('click', () => {
  var topic = document.getElementById('researchTopic').value;
  console.log(topic);
  chrome.runtime.sendMessage( { message: "startTimer", topic: topic }, (response) => {
    console.log(response.message);
  } );
  start.setAttribute('disabled',true);
})