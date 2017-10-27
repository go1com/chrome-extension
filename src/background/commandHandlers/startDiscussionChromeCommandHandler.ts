import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import {IStorageService, IStorageServiceSymbol} from "../../services/storageService/IStorageService";
import {inject, injectable} from "inversify";

@injectable()
export class StartDiscussionChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.startDiscussion;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.storageService.store(configuration.constants.localStorageKeys.createNoteParams, {
      url: sender.tab.url,
      quotation: request.data && request.data.quotation || '',
      quotationPosition: request.data && request.data.quotationPosition || ''
    });

    sendResponse(true);
  }
}
