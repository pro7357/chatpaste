const enableLive = document.getElementById("enableLive");
const enableHTML = document.getElementById("enableHTML");
const sendButton = document.getElementById("sendButton");
const tokenInput = document.getElementById("tokenInput");
const serverInput = document.getElementById("serverInput");

// Initialize using values from background.js
chrome.runtime.sendMessage({ action: "getLiveState" }, function (response) {
  enableLive.checked = response.value;
});

chrome.runtime.sendMessage({ action: "getHTMLState" }, function (response) {
  enableHTML.checked = response.value;
});

chrome.runtime.sendMessage({ action: "getTokenValue" }, function (response) {
  tokenInput.value = response.value;
});

chrome.runtime.sendMessage({ action: "getServerValue" }, function (response) {
  serverInput.value = response.value;
});

// Update the script state in background.js
function updateValueInBackground(action, value) {
  chrome.runtime.sendMessage({ action: action, value: value });
}

enableLive.addEventListener("change", function () {
  updateValueInBackground("updateLiveState", enableLive.checked);
});

enableHTML.addEventListener("change", function () {
  updateValueInBackground("updateHTMLState", enableHTML.checked);
});

tokenInput.addEventListener("change", function () {
  updateValueInBackground("updateTokenValue", tokenInput.value);
});

serverInput.addEventListener("change", function () {
  updateValueInBackground("updateServerValue", serverInput.value);
});

const popup = document.querySelector("body");
popup.addEventListener("mouseleave", function() {
  tokenInput.dispatchEvent(new Event("change"));
  serverInput.dispatchEvent(new Event("change"));
});

sendButton.addEventListener("click", async () => {
  // Get the current active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  // Execute content script to get chats in the page
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getChats,
    args: [enableHTML.checked]
  });
});

function cleanText(rawText) {
  rawText[0] = rawText[0].replace(/^([0-9]+\s\/\s[0-9]+)([^0-9])/,"Prompt: $1\n$2");
  rawText[0] = rawText[0].replace(/^ChatGPTChatGPT([0-9]+\s\/\s[0-9]+)([^0-9])/,"ChatGPT: $1\n$2");
  return rawText;
}

// Function to get chats in the page
async function getChats(isHTML) {
  const allChats = document.querySelector(".flex.flex-col.text-sm.dark\\:bg-gray-800").childNodes;
  for (let i = 0; i < allChats.length; i++) {
    let chatText;
    if (isHTML) {
      chatText = allChats[i].innerHTML.split('\n');
    } else {
      chatText = cleanText(allChats[i].textContent.split('\n'));
    }
    // Promisify the sendMessage function
    const sendMessageAsync = (message) =>
      new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "chats", value: chatText }, (response) => {
          resolve(response);
        });
      });

    // Wait for the response before proceeding to the next iteration
    await sendMessageAsync({ action: "chats", value: chatText });
  }
}
