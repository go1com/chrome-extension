import {Injectable} from "@angular/core";
import go1Config from "../../go1core/go1core.config";
import {RestClientService} from "../../go1core/services/RestClientService";

@Injectable()
export class DiscussionService {
  private baseUrl = go1Config.baseApiUrl;
  private customHeaders = {
    'Authorization': `Bearer ${ localStorage.getItem('jwt') }`
  };

  constructor(private restClientService: RestClientService) {

  }

  getUserNotes() {
    return this.restClientService.getAsync(`${this.baseUrl}/note-service/notes`, this.customHeaders);
  }
}
