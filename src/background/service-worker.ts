// AI Toolbox — Background Service Worker (Manifest V3)

const TOOL_MENU_ITEMS = [
  { id: "email", title: "Write Email from Selection" },
  { id: "meeting", title: "Summarize as Meeting Notes" },
  { id: "code", title: "Review Selected Code" },
  { id: "blog", title: "Generate Blog Post" },
  { id: "product", title: "Write Product Copy" },
  { id: "tweet", title: "Create Tweet Thread" },
];

// Create context menus on install
chrome.runtime.onInstalled.addListener(() => {
  // Parent menu
  chrome.contextMenus.create({
    id: "ai-toolbox",
    title: "AI Toolbox",
    contexts: ["selection"],
  });

  // Child menus for each tool
  TOOL_MENU_ITEMS.forEach((item) => {
    chrome.contextMenus.create({
      id: `ai-toolbox-${item.id}`,
      parentId: "ai-toolbox",
      title: item.title,
      contexts: ["selection"],
    });
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.menuItemId?.toString().startsWith("ai-toolbox-")) return;

  const toolId = info.menuItemId.toString().replace("ai-toolbox-", "");
  const selectedText = info.selectionText || "";

  // Open side panel
  if (tab?.id) {
    await chrome.sidePanel.open({ tabId: tab.id });

    // Small delay to let the panel load, then send the tool + text
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: "SELECT_TOOL",
        toolId,
        text: selectedText,
      });
    }, 500);
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "OPEN_SIDE_PANEL") {
    // Get current tab and open side panel
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (tab?.id) {
        await chrome.sidePanel.open({ tabId: tab.id });

        if (message.toolId) {
          setTimeout(() => {
            chrome.runtime.sendMessage({
              type: "SELECT_TOOL",
              toolId: message.toolId,
            });
          }, 500);
        }
      }
    });
    sendResponse({ ok: true });
  }
  return true;
});

// Enable side panel on all pages
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
