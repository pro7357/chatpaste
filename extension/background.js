chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  request.chats[0] = request.chats[0].replace(/^([0-9]+\s\/\s[0-9]+)(\w)/,"\n$1\n$2");

  fetch('http://127.0.0.1:8080/', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "token": request.token,
      "lines": request.chats
    })
  }).catch(function(error) {
    console.log('Error: Failed sending chats to http://127.0.0.1:8080.', error);
  });

  sendResponse({ message: 'chats received' });
});
