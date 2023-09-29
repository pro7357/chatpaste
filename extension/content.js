let isLiveRunning = false;
let isLiveEnabled = true;
let isHTMLEnabled = false;
let loggingObserver = null;

// Initialize using values from background.js
chrome.runtime.sendMessage({ action: "getLiveState" }, function (response) {
  isLiveEnabled = response.value;
});

chrome.runtime.sendMessage({ action: "getHTMLState" }, function (response) {
  isHTMLEnabled = response.value;
});

// Listen for messages from background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "isLiveEnabled") {
    isLiveEnabled = message.value;
    if (isLiveEnabled && !isLiveRunning) {
      startLogging();
    } else if (!isLiveEnabled) {
      stopLogging();
    }
  } else if (message.action === "isHTMLEnabled") {
    if (isHTMLEnabled !== message.value) {
      isHTMLEnabled = message.value;
      if (isLiveEnabled && !isLiveRunning) {
        startLogging();
      }
    }
  }
});

function updateRunningState() {
  chrome.runtime.sendMessage({ action: "updateRunningState", value: isLiveRunning }, () => {});
}

async function startLogging() {
  if (!isLiveRunning) {
    isLiveRunning = true;
    updateRunningState();
    loggingPromise = liveLogging();
    try {
      await loggingPromise;
    } catch {
      stopLogging();
      startLogging();
    }
  }
}

function stopLogging() {
  if (loggingObserver) {
    loggingObserver.disconnect();
    loggingObserver = null;
  }
  if (loggingPromise) {
    loggingPromise.catch(() => {});
    loggingPromise = null;
  }
  isLiveRunning = false;
  updateRunningState();
}

// Clean the text by adding line breaks between numbers and text
function cleanText(rawText) {
  rawText[0] = rawText[0].replace(/^([0-9]+\s\/\s[0-9]+)([^0-9])/,"Prompt: $1\n$2");
  rawText[0] = rawText[0].replace(/^ChatGPTChatGPT([0-9]+\s\/\s[0-9]+)([^0-9])/,"ChatGPT: $1\n$2");
  return rawText;
}

function handleChats(chatText) {
  chrome.runtime.sendMessage({ action: "chats", value: chatText }, () => {});
}

function handleUserPrompt(){
  let chatElement = document.querySelector(".flex.flex-col.text-sm.dark\\:bg-gray-800").children;
  let thirdElement = chatElement[chatElement.length-3]?.querySelector('.markdown');
  let secondElement = chatElement[chatElement.length-2]?.querySelector('.markdown');

  let chatText;
  if (thirdElement === null) {
    if (isHTMLEnabled) {
      chatText = chatElement[chatElement.length-3].innerHTML.split('\n');
    } else {
      chatText = cleanText(chatElement[chatElement.length-3].textContent.split('\n'));
    }
    handleChats(chatText);
  } else if (secondElement === null) {
    if (isHTMLEnabled) {
      chatText = chatElement[chatElement.length-2].innerHTML.split('\n');
    } else {
      chatText = cleanText(chatElement[chatElement.length-2].textContent.split('\n'));
    }
    handleChats(chatText);
  }
}

function handleChatResponse(){
  let chatElement = document.querySelector(".flex.flex-col.text-sm.dark\\:bg-gray-800").children;
  let thirdElement = chatElement[chatElement.length-3]?.querySelector('.markdown');
  let secondElement = chatElement[chatElement.length-2]?.querySelector('.markdown');

  let chatText;
  if (thirdElement !== null && thirdElement.classList.contains('markdown')) {
    if (isHTMLEnabled) {
      chatText = chatElement[chatElement.length-3].innerHTML.split('\n');
    } else {
      chatText = cleanText(chatElement[chatElement.length-3].textContent.split('\n'));
    }
    handleChats(chatText);
  } else if (secondElement !== null && secondElement.classList.contains('markdown')) {
    if (isHTMLEnabled) {
      chatText = chatElement[chatElement.length-2].innerHTML.split('\n');
    } else {
      chatText = cleanText(chatElement[chatElement.length-2].textContent.split('\n'));
    }
    handleChats(chatText);
  }
}

function liveLogging() {
  return new Promise((resolve, reject) => {
    if (!isLiveEnabled) {
      resolve();
      return;
    }
    loggingObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const addedNodes = Array.from(mutation.addedNodes);
        const removedNodes = Array.from(mutation.removedNodes);

        if (addedNodes.some((node) => node.matches && node.matches(".absolute.bottom-0.right-2.top-0.p-1.md\\:right-3.md\\:p-2"))) {
          handleUserPrompt();
        }

        if (removedNodes.some((node) => node.matches && node.matches(".absolute.bottom-0.right-2.top-0.p-1.md\\:right-3.md\\:p-2"))) {
          handleChatResponse();
        }
      });
    });

    loggingObserver.observe(document.documentElement, { childList: true, subtree: true });
  });
}

// Check if the page is loaded and start logging
function isPage() {
  return new Promise((resolve, reject) => {
    setTimeout(() => { reject(); }, 3000);

    const checkPage = () => {
      const pageMarker = document.querySelector("div.overflow-hidden.w-full.h-full.relative.flex.z-0");
      if (pageMarker) {
        resolve();
      } else {
        setTimeout(checkPage, 800);
      }
    };
    checkPage();
  });
}
isPage().then((result) => {
  startLogging();
});
