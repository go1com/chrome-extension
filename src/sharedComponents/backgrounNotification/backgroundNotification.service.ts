import io from 'socket.io-client';
import configuration from "../../environments/configuration";
import * as _ from 'lodash';
import {RestClientService} from "../../modules/go1core/services/RestClientService";
import {Injectable} from "@angular/core";

declare const $: any;

@Injectable()
export class BackgroundNotificationService {
  private socket;
  private unreadMessages = 0;
  private messages = [];

  private static _instance: BackgroundNotificationService;

  static singleInstance() {
    if (!BackgroundNotificationService._instance) {
      BackgroundNotificationService._instance = new BackgroundNotificationService(new RestClientService());
    }

    return BackgroundNotificationService._instance;
  }

  constructor(private restClientService: RestClientService) {
  }

  initialize(userId: number) {
    this.socket = io(configuration.serviceUrls.notification);
    this.unreadMessages = 0;
    this.messages = [];
    this.socket.emit('online', userId);

    this.socket.on('notification', (notificationMessage) => {
      if (notificationMessage.is_read)
        return;

      this.messages.push(notificationMessage);

      this.messages = _.sortBy(this.messages, 'created').reverse();

      chrome.notifications.create(`go1-extension-realtime-notification-${new Date(notificationMessage.created).getTime()}`, {
        iconUrl: '/assets/icon.png',
        type: 'basic',
        message: `${$(notificationMessage.message).text()}`,
        title: `GO1 Extension`
      });

      this.unreadMessages++;
      chrome.browserAction.setBadgeText({
        text: `${ this.unreadMessages }`
      });
    });

    return new Promise((resolve, reject) => {
      this.socket.on('old notification', (list) => {
        this.messages = this.messages.concat(list);

        this.messages = _.sortBy(this.messages, 'created').reverse();
        resolve(this.messages);
      });
    });
  }

  getUnreadMessagesCount() {
    return this.unreadMessages;
  }

  getMessages() {
    return _.sortBy(this.messages, 'created').reverse();
  }

  resetUnreadMessages() {
    this.messages.forEach(notification => {
      if (notification.is_read)
        return;

      notification.is_read = true;
      delete notification.instance;

      this.restClientService.put(`${configuration.serviceUrls.notification}/notification`, notification);
    });

    this.unreadMessages = 0;
    chrome.browserAction.setBadgeText({
      text: ''
    });
  }
}
