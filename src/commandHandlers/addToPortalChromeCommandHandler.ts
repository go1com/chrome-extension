import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import {RestClientService} from "../modules/go1core/services/RestClientService";
import {commandKeys} from "./commandKeys";
import configuration from "../environments/configuration";

export class AddToPortalChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.addToPortal;

  private restClientService: RestClientService;
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
    this.restClientService = new RestClientService();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.storageService.store(configuration.constants.localStorageKeys.addToPortalParams, {
      url: sender.tab.url
    });

    let url = `${configuration.constants.indexPage}`;
    window.open(url, configuration.constants.popupDefaultName, `height=645px,width=425px,right=10px,top=10px,resizable=0`);
  }
}
