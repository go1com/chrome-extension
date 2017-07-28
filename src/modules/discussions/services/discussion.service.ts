import {Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import firebase from 'firebase';
import {environment} from "../../../environments/index";

@Injectable()
export class DiscussionService {
  private baseUrl = environment.baseApiUrl;
  private customHeaders: any;
  private fireBaseDb: firebase.database.Database;

  constructor(private restClientService: RestClientService,
              private storageService: StorageService) {
    this.fireBaseDb = firebase.database();

    this.customHeaders = {
      'Authorization': `Bearer ${ storageService.retrieve('jwt') }`
    };
  }

  getUserNotesFromService() {
    return this.restClientService.get(`${this.baseUrl}/${environment.noteServicePath}notes`, this.customHeaders);
  }

  async getUserNote(uuid: string) {
    return new Promise((resolve, reject) => {
      let ref = this.fireBaseDb.ref(environment.fireBaseNotePath + uuid);

      ref.on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  async createNote(newNote: any) {
    const response = await this.restClientService.post(this.makeNoteRequestUrl(newNote), null, this.customHeaders);

    let newNoteFireObject = this.fireBaseDb.ref(environment.fireBaseNotePath + response.uuid);

    const randomKey = '-' + this.randomString(19);
    let childData = {};
    childData[randomKey] = {
      name: newNote.title,
      message: newNote.body,
      item: newNote.item || '',
      quote: newNote.quote || '',
      user_id: newNote.user.id,
      created: new Date().getTime()
    };
    newNoteFireObject.set({
      user_id: newNote.user.id,
      name: newNote.title,
      data: childData
    });
  }

  randomString(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  makeNoteRequestUrl(newNote) {
    const validEntityTypes = ['lo', 'portal', 'group'];
    let endpoint = `${this.baseUrl}/${environment.noteServicePath}note/`;

    if (newNote.customType) {
      validEntityTypes.push(newNote.customType);
      newNote.entityType = newNote.customType;
    }

    if (newNote.entityType && validEntityTypes.indexOf(newNote.entityType) >= 0) {
      endpoint += [newNote.entityType, newNote.entityId].join('/');
    } else {
      endpoint += '/' + newNote.loid;
    }

    return endpoint;
  }
}
