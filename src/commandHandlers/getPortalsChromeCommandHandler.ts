import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import {commandKeys} from "./commandKeys";
import {PortalService} from "../modules/portal/services/PortalService";
import configuration from "../environments/configuration";

export class GetPortalsChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.getPortals;

  private storageService: StorageService;
  private portalService: PortalService;

  constructor() {
    this.storageService = new StorageService();
    this.portalService = new PortalService(null, this.storageService);
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.portalService.getPortals()
      .then(portals => {
        sendResponse({
          portals: portals,
          defaultPortal: this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId)
        });
      });
  }
}
