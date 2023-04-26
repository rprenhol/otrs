const browser = chrome ? chrome : browser;
var urlOtrs = null;

const enableInTab = () => {
  browser.tabs.query({ active: true }, function (tabs) {
    for (const tab of tabs) {
      if (urlOtrs && tab.url.includes(urlOtrs)) {
        browser.pageAction.show(tab.id);
      } else {
        browser.pageAction.hide(tab.id);
      }
    }
  });
};
const loadPrefs = () => {
  browser.storage.local.get("url", (result) => {
    urlOtrs = result.url || "";
  });

  enableInTab();
};

console.log(`OTRS ${Date()}`);
loadPrefs();

/**
 * Listening for popup requests
 */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "changePrefs":
      loadPrefs();
      break;
    case "getUrl":
      sendResponse({ url: urlOtrs });
      break;
    default:
      break;
  }
});
browser.tabs.onActivated.addListener(enableInTab);
browser.tabs.onUpdated.addListener(enableInTab);
