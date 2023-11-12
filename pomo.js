const start = document.getElementById('start-button');
const end = document.getElementById('end-button');

const load = () => {
  chrome.storage.sync.get(
    { start: false, stop: true},
    (items) => {
      if (items.start) {
        start.setAttribute('disabled','');
      }
      if (items.stop) {
        end.setAttribute('disabled','');
      }
    }
  )
}

const save = () => {
  var savestart = start.getAttribute('disabled');
  var savestop = end.getAttribute('disabled');

  chrome.storage.sync.set(
    {start: savestart, stop: savestop},
    () => {
      var status = document.getElementById('status');
      status.innerText = 'Status saved';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  )
}

start.addEventListener('click', () => {
  var topic = document.getElementById('researchTopic').value;
  console.log(topic);
  chrome.runtime.sendMessage( { message: "startTimer", topic: topic }, (response) => {
    console.log(response.message);
  } );
  start.setAttribute('disabled',true);
  end.setAttribute('disabled',false);
  save;
})

end.addEventListener('click', () => {
  chrome.runtime.sendMessage( { message: "kill"}, (response) => {
    console.log(response.message);
  } );
  start.setAttribute('disabled',false);
  end.setAttribute('disabled',true);
})

document.addEventListener('DOMContentLoaded', load);
