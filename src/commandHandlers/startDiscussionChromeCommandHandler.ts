import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import {commandKeys} from "./commandKeys";
import configuration from "../environments/configuration";
import {RestClientService} from "../modules/go1core/services/RestClientService";

export class StartDiscussionChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.startDiscussion;

  private restClientService: RestClientService;
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
    this.restClientService = new RestClientService();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.storageService.store(configuration.constants.localStorageKeys.createNoteParams, {
      url: sender.tab.url,
      quotation: request.quotation || ''
    });

    let url = `${configuration.constants.indexPage}`;
    window.open(url, configuration.constants.popupDefaultName, `height=625px,width=425px,right=10px,top=10px`);
  }
}
