// Saves options to chrome.storage
const saveOptions = () => {
    const workTime = document.getElementById('timeon').value;
    const breakTime = document.getElementById('timeoff').value;
  
    chrome.storage.sync.set(
      { pomodoroWork: workTime, pomodoroBreak: breakTime },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
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
        document.getElementById('timeoff').checked = items.pomodoroBreak;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  