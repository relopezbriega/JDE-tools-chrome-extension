// content.js

// This function will run when the content script is loaded
(function() {
    console.log("Content script loaded!");

    // Example: Change the background color of the current page
    document.body.style.backgroundColor = "lightblue";

    // Example: Send a message to the background script
    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        console.log(response.farewell);
    });

    // Example: Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.greeting === "hello") {
            sendResponse({farewell: "goodbye"});
        }
    });
})();