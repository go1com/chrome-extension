import {EventEmitter, Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import firebase from 'firebase';
import configuration from "../../../environments/configuration";
import {Observable} from "rxjs/Observable";

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
    let url = `${this.baseUrl}/${configuration.serviceUrls.noteService}notes`;

    if (configuration.currentChromeTab && configuration.currentChromeTab.url) {
      url += `?context[url]=${configuration.currentChromeTab.url}`;
    }

    return this.restClientService.get(url, this.getCustomHeaders());
  }

  async getUserNote(uuid: string) {
    return new Promise((resolve, reject) => {
      let ref = this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + uuid);

      ref.on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  subscribeUserNote(uuid: string) {
    return Observable.create((observer) => {
      let ref = this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + uuid);

      ref.on('value', (snapshot) => {
        observer.next(snapshot.val());
      });
    });
  }

  async deleteNote(noteUuid: string) {
    try {
      let endpoint = `${this.baseUrl}/${configuration.serviceUrls.noteService}note/${noteUuid}`;

      const response = await this.restClientService.delete(endpoint, this.getCustomHeaders());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createNote(newNote: any) {
    const response = await this.restClientService.post(
      `${this.makeNoteRequestUrl(newNote)}`,
      null,
      this.getCustomHeaders());

    let newNoteFireObject = this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + response.uuid);

    const randomKey = '-Kri' + this.randomString(16);
    let childData = {};

    let firebaseObject = {
      user_id: newNote.user.id,
      name: newNote.uniqueName,
      data: childData
    };
    newNoteFireObject.set(firebaseObject);

    await this.addMessage(response.uuid, {
      name: newNote.title,
      message: newNote.body,
      item: newNote.item || '',
      quote: newNote.quote || '',
      user_id: newNote.user.id,
      created: new Date().getTime()
    });

    return firebaseObject;
  }

  async addMessage(uuid: any, messageData: any) {
    return await this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + uuid).child('data')
      .push(messageData);
  }

  async addReply(noteUuid: any, messageId: any, messageData: any) {
    return await this.fireBaseDb.ref(`${configuration.serviceUrls.fireBaseNotePath}${noteUuid}/data/${messageId}`).child('replies')
      .push(messageData);
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

    if (newNote.item) {
      endpoint += `?context[url]=${newNote.item}`;
    }

    return endpoint;
  }
}
