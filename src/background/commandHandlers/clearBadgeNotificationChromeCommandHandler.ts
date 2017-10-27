import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {BackgroundNotificationService} from "../../sharedComponents/backgrounNotification/backgroundNotification.service";

export class ClearBadgeNotificationChromeCommandHandler implements ICommandHandler {
  command = commandKeys.clearChromeBadgeNotification;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse: Function) {
    BackgroundNotificationService.singleInstance().resetUnreadMessages();
    sendResponse && sendResponse({success: true});
  }
}
