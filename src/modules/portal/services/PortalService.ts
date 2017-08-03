import {RestClientService} from "../../go1core/services/RestClientService";
import {Injectable} from "@angular/core";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";

@Injectable()
export class PortalService {
  constructor(private restClientService: RestClientService,
              private storageService: StorageService) {

  }

  async getPortal() {
    const uuid = this.storageService.retrieve(configuration.constants.localStorageKeys.uuid);

    let response = await this.restClientService.get(`${configuration.environment.baseApiUrl}/${configuration.serviceUrls.portal}public-key/${uuid}`);
  }

  async getPortals() {
    return this.storageService.retrieve(configuration.constants.localStorageKeys.portalInstance);
  }
}
