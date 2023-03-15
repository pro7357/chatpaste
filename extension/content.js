/**
 * Function to handle processing of new chats.
 * @param {string} chatToken - Token for the current chat.
 * @param {HTMLElement} chatNode - HTML element containing the chat message.
 */
function handleChats(chatToken, chatNode) {
  const chatText = chatNode.innerText.trim();

  // Check if the chat has the data-chat attribute
  if (chatNode.hasAttribute('data-chat')) {
    return;
  }

  // If the chat doesn't have the data-chat attribute, add it
  const chatId = new Date().getTime();
  chatNode.setAttribute('data-chat', chatId);

  // Send the chat to the background script
  chrome.runtime.sendMessage({ token: chatToken, chats: chatText.split('\n').filter(e => e) }, function(response) {});
}

/**
 * Function to handle processing of log messages.
 * @param {string} logToken - Token for the current log.
 */
function handleLogging(logToken) {
  const logNode = document.querySelector(".flex.flex-col.items-center.text-sm.dark\\:bg-gray-800");
  const aniNode = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4.relative.border");

  // Callback function for mutations to the logNode
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        for (const rmNode of mutation.removedNodes) {
          if (rmNode.classList && rmNode.classList.contains('text-2xl')) {
            // Get the last two chat elements
            let chatEle = logNode.children
            handleChats(logToken, chatEle[chatEle.length-3]);
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

  // Start a live logging if chat title start with a bracket.
  if (docTitle.startsWith('[')) {
    // Use the word inside bracket as a token.
    let logToken = docTitle.slice(1,docTitle.indexOf(']'));
    handleLogging(logToken);
  }
}

// Add event listener for when the window loads
window.addEventListener("load", function() {
  // Add observer for changes to the document title
  const titleObserver = new MutationObserver(handleTitleChange);
  const titleElement = document.querySelector("head title");
  if (titleElement) {
    titleObserver.observe(titleElement, { childList: true });
  }
});

//console.log("content.js initialized");