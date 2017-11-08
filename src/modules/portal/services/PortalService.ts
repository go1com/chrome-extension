import {RestClientService} from "../../go1core/services/RestClientService";
import {Injectable} from "@angular/core";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";

@Injectable()
export class PortalService {
  constructor(private restClientService: RestClientService,
              private storageService: StorageService) {

  }

  async getPortalForUser() {
    const uuid = await this.storageService.retrieve(configuration.constants.localStorageKeys.uuid);

    const response = await this.restClientService.get(`${configuration.environment.baseApiUrl}/${configuration.serviceUrls.portal}public-key/${uuid}`);
  }

  async getPortal(id: string | number) {
    const response = await this.restClientService.get(`${configuration.environment.baseApiUrl}/${configuration.serviceUrls.portal}${id}`);
    return response;
  }

  setDefaultPortal(portal: any) {
    this.storageService.store(configuration.constants.localStorageKeys.currentActivePortalId, portal.id);
    this.storageService.store(configuration.constants.localStorageKeys.currentActivePortal, portal);
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
}
