import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import {inject, injectable} from "inversify";
import {IStorageService, IStorageServiceSymbol} from "../../services/storageService/IStorageService";

@injectable()
export class CheckCreateNoteMenuSettingChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.checkCreateNoteSettings;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {
  }

  handle(request: any, sender: any, sendResponse: Function) {
    if (!this.storageService.retrieve(configuration.constants.localStorageKeys.authentication)) {
      if (sendResponse) {
        sendResponse(false);
      }
      return;
    }

    const createNoteSettings = this.storageService.retrieve(configuration.constants.localStorageKeys.createNoteSetting) || false;
    if (sendResponse) {
      sendResponse(createNoteSettings);
    }
  }
}
