import configuration from "./configuration";

export function ensureChromeTabLoaded() {
  return new Promise((resolve, reject) => {
    function checkChromeTab() {
      if (configuration.currentChromeTab) {
        resolve(configuration.currentChromeTab);
        return;
      }

      //
      // if (chrome && chrome.tabs && chrome.tabs.query) {
      //   chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      //     configuration.currentChromeTab = tabs[0];
      //     chrome.runtime.connect();
      //     resolve(configuration.currentChromeTab);
      //   });
      // }

      setTimeout(() => checkChromeTab(), 500);
    }

    checkChromeTab();
  });
}
