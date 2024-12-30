// Create a context menu item

const contextMenuId = "jdetools-ds-import";

chrome.contextMenus.create({
  id: contextMenuId,
  title: "JDE Batch DS Import tool",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  const { menuItemId } = info;
  if (menuItemId === contextMenuId) {
    (async () => {
      const response = await chrome.tabs.sendMessage(tab.id, "JDE_DS_import");
    })();
  }
});