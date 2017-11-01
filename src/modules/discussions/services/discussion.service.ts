import {EventEmitter, Injectable} from "@angular/core";
import {RestClientService} from "../../go1core/services/RestClientService";
import {StorageService} from "../../go1core/services/StorageService";
import firebase from 'firebase';
import configuration from "../../../environments/configuration";
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';
import {DiscussionNoFirebaseServiceService} from "./discussionNoFirebase.service";

@Injectable()
export class DiscussionService extends DiscussionNoFirebaseServiceService {
  private fireBaseDb: firebase.database.Database;
  public onNoteDeleted: EventEmitter<any> = new EventEmitter<any>();
  public onNoteCreated: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected restClientService: RestClientService,
              protected storageService: StorageService) {
    super(restClientService, storageService);
    if (firebase.apps.length === 0) {
      firebase.initializeApp(configuration.environment.firebase);
    }

    this.fireBaseDb = firebase.database();
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
    return await this.fireBaseDb.ref(`${configuration.serviceUrls.fireBaseNotePath}${noteUuid}/data/${messageId}`)
      .child('replies')
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

    if (newNote.private) {
      queries.push(`private=${newNote.private}`);
    }

    if (newNote.portalId) {
      queries.push(`instance=${newNote.portalId}`);
    }

    if (queries.length) {
      endpoint += '?' + queries.join('&');
    }

    return endpoint;
  }
}
