chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Send the chats to your local server via fetch
  fetch('http://127.0.0.1:8080/', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "token": request.token,
      "lines": request.chats
    })
  }).catch(function(error) {
    console.error('Error sending chats to server:', error);
  });

  sendResponse({ message: 'chats received' });

  return true;  // Tell Chrome that we'll handle the response asynchronously
});