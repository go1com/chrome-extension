import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import {RestClientService} from "../modules/go1core/services/RestClientService";
import {commandKeys} from "./commandKeys";
import {BackgroundNotificationService} from "../sharedComponents/backgrounNotification/backgroundNotification.service";
import configuration from "../environments/configuration";

export class ClearBadgeNotificationChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.clearChromeBadgeNotification;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse: Function) {
    BackgroundNotificationService.singleInstance().resetUnreadMessages();
    sendResponse && sendResponse({success: true});
  }
}
