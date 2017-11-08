import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import {IStorageService, IStorageServiceSymbol} from "../../services/storageService/IStorageService";
import {inject, injectable} from "inversify";

@injectable()
export class CheckQuickButtonSettingChromeCommandHandler implements ICommandHandler {
  command = commandKeys.checkQuickButtonSettings;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {
  }


  async handle(request: any, sender: any, sendResponse: Function) {
    if (!await this.storageService.retrieve(configuration.constants.localStorageKeys.authentication)) {
      if (sendResponse) {
        sendResponse(false);
      }
      return;
    }

    const quickButtonSetting = (await this.storageService.retrieve(configuration.constants.localStorageKeys.quickButtonSetting)) || false;
    if (sendResponse) {
      sendResponse(quickButtonSetting);
    }
  }
}
