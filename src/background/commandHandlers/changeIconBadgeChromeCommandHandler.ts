import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";

export class ChangeIconBadgeChromeCommandHandler implements ICommandHandler {
  command = commandKeys.changeBrowserActionBadgeText;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse: Function) {
    chrome.browserAction.setBadgeText({
      text: request.text || '',
      tabId: sender.tab.id
    });
    chrome.browserAction.setTitle({
      title: request.title || '',
      tabId: sender.tab.id
    });

    sendResponse({success: true});
  }
}
