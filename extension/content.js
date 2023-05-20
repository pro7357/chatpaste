/**
 * Function to handle processing of new chats.
 * @param {string} chatToken - Token for the current chat.
 * @param {HTMLElement} chatNode - HTML element containing the chat message.
 */
function handleChats(chatToken, chatNode) {
  const chatText = chatNode.innerText.split('\n');

  // Send the chat to the background script
  chrome.runtime.sendMessage({ token: chatToken, chats: chatText }, (response) => {
    // Handle the response if needed
  });
}

/**
 * Function to handle processing of log messages.
 * @param {string} logToken - Token for the current log.
 */
function handleLogging(logToken) {
  const logNode = document.querySelector(".flex.flex-col.text-sm.dark\\:bg-gray-800");
  const aniNode = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4.relative.border");

  // Callback function for mutations to the aniNode
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type !== "childList") {
        continue;
      }
      if (logNode === null) {
        continue;
      }

      let chatEle = logNode.children;

      // Get the chat from user
      for (const node of mutation.addedNodes) {
        if (node.classList && node.classList.contains('text-2xl')) {
          let thirdEle = chatEle[chatEle.length-3]?.querySelector('.markdown');
          let secondEle = chatEle[chatEle.length-2]?.querySelector('.markdown');
          if (thirdEle === null) {
            handleChats(logToken, chatEle[chatEle.length-3]);
          } else if (secondEle === null) {
            handleChats(logToken, chatEle[chatEle.length-2]);
          }
        }
      }

      // Get the response from ChatGPT
      for (const node of mutation.removedNodes) {
        if (node.classList && node.classList.contains('text-2xl')) {
          let thirdEle = chatEle[chatEle.length-3]?.querySelector('.markdown');
          let secondEle = chatEle[chatEle.length-2]?.querySelector('.markdown');
          if (thirdEle !== null && thirdEle.classList.contains('markdown')) {
            handleChats(logToken, chatEle[chatEle.length-3]);
          } else if (secondEle !== null && secondEle.classList.contains('markdown')) {
            handleChats(logToken, chatEle[chatEle.length-2]);
          }
        }
      }
    }
  };

  // Observe mutations to the aniNode
  const aniObserver = new MutationObserver(callback);
  aniObserver.observe(aniNode, { childList: true, subtree: true });
}

/**
 * Function to handle changes to the document title.
 */
function handleTitleChange() {
  let docTitle = document.title;

  // Start a live logging if chat title start with a bracket with the word inside bracket as a token.
  if (docTitle.startsWith('[')) {
    let logToken = docTitle.slice(1,docTitle.indexOf(']'));
    handleLogging(logToken);
  } else if (docTitle.startsWith('New chat')) {
    handleLogging("chats");
  }
}

// Add event listener for when the window loads
window.addEventListener("load", function() {
  // Add observer for changes to the document title
  const titleObserver = new MutationObserver(handleTitleChange);
  const titleElement = document.querySelector("head title");
  if (titleElement) {
    if (titleElement.textContent === 'New chat') {
      handleLogging("chats");
    }
    titleObserver.observe(titleElement, { childList: true });
  }
});

//console.log("content.js initialized");
