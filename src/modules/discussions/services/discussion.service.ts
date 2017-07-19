import {Injectable} from "@angular/core";
import go1Config from "../../go1core/go1core.config";
import {RestClientService} from "../../go1core/services/RestClientService";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class DiscussionService {
  private baseUrl = go1Config.baseApiUrl;
  private customHeaders = {
    'Authorization': `Bearer ${ localStorage.getItem('jwt') }`
  };

  constructor(private restClientService: RestClientService,
              private fireBaseDb: AngularFireDatabase) {

  }

  getUserNotesFromService() {
    return this.restClientService.getAsync(`${this.baseUrl}/${go1Config.noteServicePath}notes`, this.customHeaders);
  }

  getUserNotesFromFB() {
    return this.fireBaseDb.list(go1Config.fireBaseNotePath);
  }

  getUserNote(uuid: string) {
    return this.fireBaseDb.object(go1Config.fireBaseNotePath + uuid);
  }
}
