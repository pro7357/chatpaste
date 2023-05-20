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
        // Handle the results if needed
      }
    );
  });
});

// Function to get chats in the page
function getChats() {
  const allChats = document.querySelector(".flex.flex-col.text-sm.dark\\:bg-gray-800").childNodes;
  for (let i = 0; i < allChats.length; i++) {
    const chatText = allChats[i].textContent.split('\n');
    chrome.runtime.sendMessage({ token: "chats", chats: chatText }, (response) => {
      // Handle the response if needed
    });
  }
}
