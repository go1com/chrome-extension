import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import {inject, injectable} from "inversify";
import {IStorageService, IStorageServiceSymbol} from "../../services/storageService/IStorageService";

@injectable()
export class CheckCreateNoteMenuSettingChromeCommandHandler implements ICommandHandler {
  command = commandKeys.checkCreateNoteSettings;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {
  }

  async handle(request: any, sender: any, sendResponse: Function) {
    if (!await this.storageService.retrieve(configuration.constants.localStorageKeys.authentication)) {
      if (sendResponse) {
        sendResponse(false);
      }
      return;
    }

    const createNoteSettings = (await this.storageService.retrieve(configuration.constants.localStorageKeys.createNoteSetting)) || false;
    if (sendResponse) {
      sendResponse(createNoteSettings);
    }
  }
}
