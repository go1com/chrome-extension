import {Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";

@Injectable()
export class AddToPortalService {
  private baseUrl = configuration.environment.baseApiUrl;
  private fireBaseDb: firebase.database.Database;

  constructor(private restClient: RestClientService,
              private storageService: StorageService) {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(configuration.environment.firebase);
    }

    this.fireBaseDb = firebase.database();
  }

  private getCustomHeaders() {
    return {
      'Authorization': `Bearer ${ this.storageService.retrieve(configuration.constants.localStorageKeys.authentication) }`
    };
  }

  async addToPortal() {

  }

  async markAsComplete() {

  }

  async scheduleForLater() {

  }
}
