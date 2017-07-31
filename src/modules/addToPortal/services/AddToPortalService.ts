import {Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {environment} from "../../../environments";
import {StorageService} from "../../go1core/services/StorageService";

@Injectable()
export class AddToPortalService {
  private baseUrl = environment.baseApiUrl;
  private customHeaders: any;
  private fireBaseDb: firebase.database.Database;

  constructor(private restClient: RestClientService,
              private storageService: StorageService) {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(environment.firebase);
    }

    this.fireBaseDb = firebase.database();

    this.customHeaders = {
      'Authorization': `Bearer ${ storageService.retrieve(environment.constants.localStorageKeys.authentication) }`
    };
  }

  async addToPortal() {

  }

  async markAsComplete() {

  }

  async scheduleForLater() {

  }
}
