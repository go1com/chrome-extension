import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {BackgroundNotificationService} from "../../sharedComponents/backgrounNotification/backgroundNotification.service";

export class CountNotificationChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.countNotificationMessages;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse: Function) {
    sendResponse && sendResponse({
      success: true,
      data: BackgroundNotificationService.singleInstance().getUnreadMessagesCount()
    });
  }
}
