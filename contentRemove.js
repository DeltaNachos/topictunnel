console.log('content script');
chrome.runtime.sendMessage({message: "good?"}, (response) => {
    if(response.message === "NO"){
    console.log("nuh uh");
    document.body.innerHTML = "<h1>Nuh uh</h1> <img src='"+chrome.runtime.getURL('nuh-uh-nuh.gif')+"' alt='nuh uh'/>";
}  
});