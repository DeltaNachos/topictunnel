// Saves options to chrome.storage
const saveOptions = () => {
    var workTime = document.getElementById('timeon').value;
    var breakTime = document.getElementById('timeoff').value;
  
    chrome.storage.sync.set(
      { pomodoroWork: workTime, pomodoroBreak: breakTime },
      () => {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.innerText = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage. 
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { pomodoroWork: '25', pomodoroBreak: '5' },
      (items) => {
        document.getElementById('timeon').value = items.pomodoroWork;
        document.getElementById('timeoff').value = items.pomodoroBreak;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  