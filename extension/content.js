/**
 * Function to handle processing of new chats.
 * @param {string} chatToken - Token for the current chat.
 * @param {HTMLElement} chatNode - HTML element containing the chat message.
 */
function handleChats(chatToken, chatNode) {
  const chatText = chatNode.textContent.split('\n');

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
  const newLine = document.createElement("br");
  const logNode = document.querySelector(".flex.flex-col.text-sm.dark\\:bg-gray-800");
  const aniNode = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4.relative.border");
  if (aniNode === null) {
        return;
  }

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
            handleChats(logToken, chatEle[chatEle.length-3].querySelector('.flex-grow.flex-shrink-0'));

            let paragraphs = chatEle[chatEle.length-3].querySelectorAll("p");
            paragraphs.forEach((paragraph) => {
              handleChats(logToken, paragraph.nextSibling);
              handleChats(logToken, newLine);
            });
          } else if (secondEle !== null && secondEle.classList.contains('markdown')) {
            handleChats(logToken, chatEle[chatEle.length-2].querySelector('.flex-grow.flex-shrink-0'));

            let paragraphs = chatEle[chatEle.length-2].querySelectorAll("p");
            paragraphs.forEach((paragraph) => {
              handleChats(logToken, paragraph);
              handleChats(logToken, newLine);
            });
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
  } else {
    handleLogging("chats");
  }
}

let isLoggingStarted = false;

// Add event listener for when the window loads
window.addEventListener("load", function() {
  // Add observer for changes to the document title
  const titleObserver = new MutationObserver(handleTitleChange);
  const titleElement = document.querySelector("head title");

  if (titleElement) {
    isLoggingStarted = false;
    checkAndHandleLogging();
    titleObserver.observe(titleElement, { childList: true });
  }
});

// Function to check for the overflow-y-hidden class and handle logging
function checkAndHandleLogging() {
  const overflowHiddenElements = document.getElementsByClassName('overflow-y-hidden');

  if (overflowHiddenElements.length > 0 && !isLoggingStarted) {
    isLoggingStarted = true;
    handleLogging("chats");
  }
}

// Mutation observer for the entire document body
const bodyObserver = new MutationObserver(function(mutations) {
  checkAndHandleLogging();
});

bodyObserver.observe(document.body, { attributes: true, subtree: true });

// Call the checkAndHandleLogging function initially to check if the class is already present
checkAndHandleLogging();

//console.log("content.js initialized");
