const start = document.getElementById('start-button');
const end = document.getElementById('end-button');

const load = () => {
  chrome.storage.sync.get(
    { start: false, stop: true},
    (items) => {
      if (items.start) {
        start.setAttribute('disabled',true);
      }
      if (items.stop) {
        end.setAttribute('disabled',true);
      }
    }
  )
}

const save = () => {
  var savestart = start.hasAttribute('disabled');
  var savestop = end.hasAttribute('disabled');

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
  var port = chrome.runtime.connect({name:"start"});
  port.postMessage({message:"startTimer", topic:topic});
  // chrome.runtime.sendMessage( { message: "startTimer", topic: topic } );
  start.setAttribute('disabled',true);
  end.removeAttribute('disabled');
  save();
})

end.addEventListener('click', () => {
  var port = chrome.runtime.connect({name:"start"});
  port.postMessage({message:"kill"});
  // chrome.runtime.sendMessage( { message: "kill"} );
  start.removeAttribute('disabled');
  end.setAttribute('disabled',true);
  save();
})

document.addEventListener('DOMContentLoaded', load);
