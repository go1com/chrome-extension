import {Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";

@Injectable()
export class AddToPortalService {
  private baseUrl = configuration.environment.baseApiUrl;

  constructor(private restClient: RestClientService,
              private storageService: StorageService) {
  }

  private getCustomHeaders() {
    return {
      'Authorization': `Bearer ${ this.storageService.retrieve(configuration.constants.localStorageKeys.authentication) }`
    };
  }

  async addToPortal(data: any) {
    return this.restClient.post(
      `${configuration.environment.baseApiUrl}/${configuration.serviceUrls.lo}li`,
      data,
      this.getCustomHeaders());
  }

  async updateLearningItem(data: any) {
    return this.restClient.put(
      `${configuration.environment.baseApiUrl}/${configuration.serviceUrls.lo}li/${data.id}`,
      data,
      this.getCustomHeaders());
  }
}
