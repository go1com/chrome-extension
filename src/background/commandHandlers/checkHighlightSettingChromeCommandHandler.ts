import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import {IStorageService, IStorageServiceSymbol} from "../../services/storageService/IStorageService";
import {inject, injectable} from "inversify";

@injectable()
export class CheckHighlightSettingChromeCommandHandler implements ICommandHandler {
  command = commandKeys.checkHighlightNoteSettings;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {
  }


  async handle(request: any, sender: any, sendResponse: Function) {
    if (!await this.storageService.retrieve(configuration.constants.localStorageKeys.authentication)) {
      if (sendResponse) {
        sendResponse(false);
      }
      return;
    }

    const highlightSetting = await this.storageService.retrieve(configuration.constants.localStorageKeys.highlightNoteSetting) || false;
    if (sendResponse) {
      sendResponse(highlightSetting);
    }
  }
}
