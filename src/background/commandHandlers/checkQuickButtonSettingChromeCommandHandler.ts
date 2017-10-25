import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import {IStorageService, IStorageServiceSymbol} from "../../services/storageService/IStorageService";
import {inject, injectable} from "inversify";

@injectable()
export class CheckQuickButtonSettingChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.checkQuickButtonSettings;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {
  }


  handle(request: any, sender: any, sendResponse: Function) {
    if (!this.storageService.retrieve(configuration.constants.localStorageKeys.authentication)) {
      if (sendResponse) {
        sendResponse(false);
      }
      return;
    }

    const quickButtonSetting = this.storageService.retrieve(configuration.constants.localStorageKeys.quickButtonSetting) || false;
    if (sendResponse) {
      sendResponse(quickButtonSetting);
    }
  }
}
