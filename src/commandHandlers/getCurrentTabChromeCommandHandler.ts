import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {commandKeys} from "./commandKeys";

export class GetCurrentTabChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.getCurrentTab;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse: Function) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      sendResponse(tabs[0]);
    });
  }
}
