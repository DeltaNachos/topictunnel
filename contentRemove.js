chrome.runtime.onMessage.addListener(function (request, sender, sendresponse) {
    if(request.message === "starttimer"){
        document.body = "<h1>Nuh uh</h1> <img src=\"nuh-uh-nuh.gif\"></img>";
    }    
})