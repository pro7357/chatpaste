// Listen for clicks on the test button
document.getElementById("test-btn").addEventListener("click", () => {
  // Get the current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    // Execute content script to get chats in the page
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: getChats,
      },
      (results) => {
        // Extract and send the chat messages to the background script
        const chats = results[0].result.map(chat => chat.trim()).filter(chat => chat);
        chrome.runtime.sendMessage({ token: "chats", chats });
      }
    );
  });
});

// Function to get chats in the page
function getChats() {
  // Get the chat container element and extract the chat text
  const chatContainer = document.querySelector('div.overflow-hidden.w-full.h-full.relative div.flex.h-full.flex-1.flex-col.md\\:pl-\\[260px\\] main div');
  const chatText = chatContainer.innerText;

  // Split the chat text into an array and return it
  const chats = chatText.split('\n');
  return chats;
}
