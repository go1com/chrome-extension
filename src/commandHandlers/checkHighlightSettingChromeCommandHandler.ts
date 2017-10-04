import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import {commandKeys} from "./commandKeys";
import configuration from "../environments/configuration";

export class CheckHighlightSettingChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.checkHighlightNoteSettings;

  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    if (!this.storageService.retrieve(configuration.constants.localStorageKeys.authentication)) {
      if (sendResponse) {
        sendResponse(false);
      }
      return;
    }

    const highlightSetting = this.storageService.retrieve(configuration.constants.localStorageKeys.highlightNoteSetting) || false;
    if (sendResponse) {
      sendResponse(highlightSetting);
    }
  }
}
