import {Injectable} from "@angular/core";
import go1Config from "../../go1core/go1core.config";
import {RestClientService} from "../../go1core/services/RestClientService";
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from 'firebase';

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

  createNote(newNote: any) {
    return new Promise(async (resolve, reject) => {
      const response = await this.restClientService.postAsync(this.makeNoteRequestUrl(newNote), null, this.customHeaders);

      let newNoteFireObject = this.fireBaseDb.object(go1Config.fireBaseNotePath + response.uuid);

      const randomKey = '-' + this.randomString(19);
      let childData = {};
      childData[randomKey] = {
        message: newNote.body,
        user_id: newNote.user.id,
        created: new Date().getTime()
      };
      newNoteFireObject.set({
        user_id: newNote.user.id,
        name: newNote.title,
        data: childData
      });

      resolve();
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
    let endpoint = `${this.baseUrl}/${go1Config.noteServicePath}note/`;

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
