import {EventEmitter, Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import firebase from 'firebase';
import configuration from "../../../environments/configuration";
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';

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

    let queries = [];

    queries.push(`type=${configuration.constants.noteChromeExtType}`);

    if (configuration.currentChromeTab && configuration.currentChromeTab.url) {
      queries.push(`context\\[url\\]=${configuration.currentChromeTab.url}`);
    }

    if (queries.length) {
      url += `?${queries.join('&')}`;
    }

    return this.restClientService.get(url, this.getCustomHeaders());
  }

  async getUserNote(uuid: string) {
    return new Promise((resolve, reject) => {
      const ref = this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + uuid);

      ref.on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  subscribeUserNote(uuid: string) {
    return Observable.create((observer) => {
      const ref = this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + uuid);

      ref.on('value', (snapshot) => {
        observer.next(snapshot.val());
      });
    });
  }

  async deleteNote(noteUuid: string) {
    try {
      const endpoint = `${this.baseUrl}/${configuration.serviceUrls.noteService}note/${noteUuid}`;

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

    const newNoteFireObject = this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + response.uuid);

    const childData = {};

    const firebaseObject = {
      user_id: newNote.user.id,
      name: newNote.uniqueName,
      data: childData,
    };
    newNoteFireObject.set(firebaseObject);

    await this.addMessage(response.uuid, {
      name: newNote.title,
      message: newNote.body,
      item: newNote.item || '',
      quote: newNote.quote || '',
      metadata: newNote.context,
      user_id: newNote.user.id,
      created: new Date().getTime()
    });

    const clonedFirebaseObj: any = _.cloneDeep(firebaseObject);
    clonedFirebaseObj.$uuid = response.uuid;

    return clonedFirebaseObj;
  }

  async addMessage(uuid: any, messageData: any) {
    return await this.fireBaseDb.ref(configuration.serviceUrls.fireBaseNotePath + uuid).child('data')
      .push(messageData);
  }

  async mentionUsers(uuid: any, mentionedUsers: string[]) {
    const payloadBody = {
      notify: true,
      privacy: {
        connection: {
          type: "custom",
          friends: mentionedUsers
        }
      }
    };

    return await this.restClientService.post(
      `${this.baseUrl}/${configuration.serviceUrls.noteService}share/user/${uuid}`,
      payloadBody,
      this.getCustomHeaders());
  }

  async addReply(noteUuid: any, messageId: any, messageData: any) {
    return await this.fireBaseDb.ref(`${configuration.serviceUrls.fireBaseNotePath}${noteUuid}/data/${messageId}`).child('replies')
      .push(messageData);
  }

  makeNoteRequestUrl(newNote) {
    const validEntityTypes = ['lo', 'portal', 'group', configuration.constants.noteChromeExtType];
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

    const queries: string[] = [];

    Object.keys(newNote.context).forEach((key) => {
      queries.push(`context[${key}]=${newNote.context[key]}`);
    });

    if (newNote.portalId) {
      queries.push(`instance=${newNote.portalId}`);
    }

    if (queries.length) {
      endpoint += '?' + queries.join('&');
    }

    return endpoint;
  }
}
