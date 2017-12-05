import { ICommandHandler } from "../../services/commandHandlerService/ICommandHandler";
import { commandKeys } from "../../environments/commandKeys";
import configuration from "../../environments/configuration";
import { IStorageService, IStorageServiceSymbol } from "../../services/storageService/IStorageService";
import { inject, injectable } from "inversify";
import { SharedPortalService } from "../../services/portalService/PortalService";

@injectable()
export class OnPortalChangedChromeCommandHandler implements ICommandHandler {
  command = commandKeys.portalInstanceChanged;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService,
              @inject(SharedPortalService) private portalService: SharedPortalService) {
  }


  async handle(request: any, sender: any, sendResponse: Function) {
    const portal = await this.portalService.getDefaultPortalInfo();
    const user = await this.storageService.retrieve(configuration.constants.localStorageKeys.user);

    if (!this.portalService.canAddToPortal(portal, user)) {
      chrome.contextMenus.update('add-to-portal-menu', {
        enabled: false
      });
    } else {
      chrome.contextMenus.update('add-to-portal-menu', {
        enabled: true
      });
    }
  }
}
