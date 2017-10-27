import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {StorageService} from "../../modules/go1core/services/StorageService";
import {RestClientService} from "../../modules/go1core/services/RestClientService";
import {commandKeys} from "../../environments/commandKeys";
import {BackgroundNotificationService} from "../../sharedComponents/backgrounNotification/backgroundNotification.service";
import configuration from "../../environments/configuration";

export class OnUserLoggedInChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.userLoggedIn;

  private restClientService: RestClientService;
  private storageService: StorageService;
  private notificationService: BackgroundNotificationService;

  constructor() {
    this.storageService = new StorageService();
    this.restClientService = new RestClientService();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.initialize();
    if (sendResponse) {
      sendResponse({success: true});
    }
  }

  initialize() {
    const user = this.storageService.retrieve(configuration.constants.localStorageKeys.user);
    if (!user || !user.profile_id) {
      return;
    }

    const userProfileId = user.profile_id;

    this.notificationService = BackgroundNotificationService.singleInstance();
    this.notificationService.initialize(userProfileId);
  }
}
