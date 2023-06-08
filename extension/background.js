let isLiveRunning = true;
let isLiveEnabled = true;
let isHTMLEnabled = false;
let serverValue = "http://127.0.0.1:8080/";
let tokenValue = "iloveweb"; //i love tomnomnom too, no homo bro.

// Initialize values from chrome.storage.local
function loadStorageValues() {
  chrome.storage.local.get(["isLiveEnabled", "isHTMLEnabled", "server", "token"], function (result) {
    isLiveEnabled = result.isLiveEnabled !== undefined ? result.isLiveEnabled : isLiveEnabled;
    isHTMLEnabled = result.isHTMLEnabled !== undefined ? result.isHTMLEnabled : isHTMLEnabled;
    serverValue = result.server !== undefined ? result.server : serverValue;
    tokenValue = result.token !== undefined ? result.token : tokenValue;
  });
}
loadStorageValues();

// Send a message to content.js to update the script state
function updateScriptState(action, value) {
  chrome.tabs.query({ url: "https://chat.openai.com/*" }, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, { action: action, value: value });
    });
  });
}

function updateExtensionIcon(isRunning) {
  const iconPath = isRunning ? {
    "16": "icon_green16.png",
    "32": "icon_green32.png",
    "48": "icon_green48.png",
    "128": "icon_green128.png"
  } : {
    "16": "icon_orange16.png",
    "32": "icon_orange32.png",
    "48": "icon_orange48.png",
    "128": "icon_orange128.png"
  };
  chrome.action.setIcon({ path: iconPath });
}
updateExtensionIcon(isLiveEnabled);

// Update the value in chrome.storage.local
function updateStorageValue(key, value) {
  const data = {};
  data[key] = value;
  chrome.storage.local.set(data);
}

function handleChat(chat) {
  fetch(serverValue, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "token": tokenValue,
      "lines": chat
    })
  }).catch(function(error) {
    console.log('Error: Failed sending chats to:', serverValue, error);
  });
}

// Listen for messages from popup.js and content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "chats") {
    handleChat(message.value);
    sendResponse();
  } else if (message.action === "getLiveState") {
    sendResponse({ value: isLiveEnabled });
  } else if (message.action === "getHTMLState") {
    sendResponse({ value: isHTMLEnabled });
  } else if (message.action === "getTokenValue") {
    sendResponse({ value: tokenValue });
  } else if (message.action === "getServerValue") {
    sendResponse({ value: serverValue });
  } else if (message.action === "updateLiveState") {
    isLiveEnabled = message.value;
    sendResponse();
    updateStorageValue("isLiveEnabled", isLiveEnabled);
    updateScriptState("isLiveEnabled", isLiveEnabled);
    if (isLiveEnabled) { 
      updateExtensionIcon(true);
    }
  } else if (message.action === "updateHTMLState") {
    isHTMLEnabled = message.value;
    sendResponse();
    updateStorageValue("isHTMLEnabled", isHTMLEnabled);
    updateScriptState("isHTMLEnabled", isHTMLEnabled);
  } else if (message.action === "updateRunningState") {
    updateExtensionIcon(message.value);
    sendResponse();
  } else if (message.action === "updateTokenValue") {
    tokenValue = message.value;
    sendResponse();
    updateStorageValue("token", tokenValue);
  } else if (message.action === "updateServerValue") {
    serverValue = message.value;
    sendResponse();
    updateStorageValue("server", serverValue);
  }
});
