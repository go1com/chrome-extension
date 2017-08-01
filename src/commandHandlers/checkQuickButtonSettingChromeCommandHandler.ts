import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import {commandKeys} from "./commandKeys";
import configuration from "../environments/configuration";

export class CheckQuickButtonSettingChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.checkQuickButtonSettings;

  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    const quickButtonSetting = this.storageService.retrieve(configuration.constants.localStorageKeys.quickButtonSetting) || false;
    if (sendResponse) {
      sendResponse(quickButtonSetting);
    }
  }
}
