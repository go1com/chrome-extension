import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import configuration from "../environments/configuration";
import {RestClientService} from "../modules/go1core/services/RestClientService";
import {commandKeys} from "./commandKeys";

export class AddToPortalChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.addToPortal;

  private restClientService: RestClientService;
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
    this.restClientService = new RestClientService();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    sendResponse({success: true});
  }
}
