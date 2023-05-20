// Listen for clicks on the test button
document.getElementById("test-btn").addEventListener("click", async () => {
  // Get the current active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  // Execute content script to get chats in the page
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getChats,
  });

  // Handle the results if needed
});

// Function to get chats in the page
async function getChats() {
  const allChats = document.querySelector(".flex.flex-col.text-sm.dark\\:bg-gray-800").childNodes;
  for (let i = 0; i < allChats.length; i++) {
    const chatText = allChats[i].textContent.split('\n');

    // Promisify the sendMessage function
    const sendMessageAsync = (message) =>
      new Promise((resolve) => {
        chrome.runtime.sendMessage({ token: "chats", chats: chatText }, (response) => {
          resolve(response);
        });
      });

    // Wait for the response before proceeding to the next iteration
    await sendMessageAsync({ token: "chats", chats: chatText });
  }
}
