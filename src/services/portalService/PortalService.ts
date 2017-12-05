import { inject, injectable } from "inversify";
import { IRestClientService, IRestClientServiceSymbol } from "../restClientService/IRestClientService";
import { IStorageService, IStorageServiceSymbol } from "../storageService/IStorageService";
import configuration from "../../environments/configuration";

@injectable()
export class SharedPortalService {
  constructor(@inject(IRestClientServiceSymbol) protected restClientService: IRestClientService,
              @inject(IStorageServiceSymbol) protected storageService: IStorageService) {

  }

  async getPortalForUser() {
    const uuid = await this.storageService.retrieve(configuration.constants.localStorageKeys.uuid);

    const response = await this.restClientService.get(`${configuration.environment.baseApiUrl}/${configuration.serviceUrls.portal}public-key/${uuid}`);
  }

  async getPortal(id: string | number) {
    const response = await this.restClientService.get(`${configuration.environment.baseApiUrl}/${configuration.serviceUrls.portal}${id}`);
    return response;
  }

  async setDefaultPortal(portal: any) {
    return Promise.all([
                         await this.storageService.store(configuration.constants.localStorageKeys.currentActivePortalId, portal.id),
                         await this.storageService.store(configuration.constants.localStorageKeys.currentActivePortal, portal)
                       ]);
  }

  async getDefaultPortalSetting() {
    return await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);
  }

  async getDefaultPortalInfo() {
    return this.getPortal(await this.getDefaultPortalSetting() || configuration.environment.defaultPortal);
  }

  async getPortals() {
    return await this.storageService.retrieve(configuration.constants.localStorageKeys.portalInstances);
  }

  canAddToPortal(portal, user): boolean {
    if (!portal || !user) {
      return false;
    }

    if (portal.configuration.public_writing) {
      return true;
    }

    const currentPortalAccount = user.accounts.find(acc => acc.instance_name === portal.title);

    if (!currentPortalAccount) {
      return false;
    }

    return currentPortalAccount.roles.indexOf('administrator') > -1;
  }
}
