import {EventEmitter, Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import firebase from 'firebase';
import configuration from "../../../environments/configuration";

@Injectable()
export class DiscussionService {
  private baseUrl = configuration.environment.baseApiUrl;
  private fireBaseDb: firebase.database.Database;
  public onNoteDeleted: EventEmitter<any> = new EventEmitter<any>();
  public onNoteCreated: EventEmitter<any> = new EventEmitter<any>();

  constructor(private restClientService: RestClientService,
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

  getUserNotesFromService() {
    return this.restClientService.get(`${this.baseUrl}/${configuration.serviceUrls.noteService}notes`, this.getCustomHeaders());
  }

  async getUserNote(uuid: string) {
    return new Promise((resolve, reject) => {
      let ref = this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + uuid);

      ref.on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  async deleteNote(noteUuid: string) {
    try {
      let endpoint = `${this.baseUrl}/${configuration.serviceUrls.noteService}note/${noteUuid}`;

      const response = await this.restClientService.delete(endpoint, this.getCustomHeaders());

      console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createNote(newNote: any) {
    const response = await this.restClientService.post(this.makeNoteRequestUrl(newNote),
      null,
      this.getCustomHeaders());

    let newNoteFireObject = this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + response.uuid);

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
    let firebaseObject = {
      user_id: newNote.user.id,
      name: newNote.uniqueName,
      data: childData
    };
    newNoteFireObject.set(firebaseObject);
    return firebaseObject;
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
    let endpoint = `${this.baseUrl}/${configuration.serviceUrls.noteService}note/`;

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
