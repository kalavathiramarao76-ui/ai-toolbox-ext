// AI Toolbox — Content Script
// Listens for messages from background to relay selected text

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_SELECTION") {
    const selection = window.getSelection()?.toString() || "";
    sendResponse({ text: selection });
  }
  return true;
});

// Log injection for debugging
console.log("[AI Toolbox] Content script loaded");
