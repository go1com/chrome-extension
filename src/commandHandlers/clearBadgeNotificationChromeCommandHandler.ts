import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {commandKeys} from "./commandKeys";
import {BackgroundNotificationService} from "../sharedComponents/backgrounNotification/backgroundNotification.service";

export class ClearBadgeNotificationChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.clearChromeBadgeNotification;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse: Function) {
    BackgroundNotificationService.singleInstance().resetUnreadMessages();
    sendResponse && sendResponse({success: true});
  }
}
