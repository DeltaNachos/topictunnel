console.log('content script');
chrome.runtime.sendMessage({message: "good?"}, (response) => {
    if(response.message === "NO"){
    console.log("nuh uh");
    document.body.innerHTML = "<h1>Nuh uh</h1> <img src='nuh-uh-nuh.gif'></img>";
}  
});