import {Component} from "@angular/core";
import {commandKeys} from "../../../commandHandlers/commandKeys";

@Component({
  selector: 'notification-component',
  templateUrl: './notification.component.pug'
})
export class NotificationComponent {
  messages: any[];
  loading: boolean = false;

  constructor() {
    this.messages = [];
  }

  ngOnInit() {
    this.loading=  true;
    chrome.runtime.sendMessage({
      action: commandKeys.getNotificationMessages
    }, (response) => {
      this.messages = response.data;
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    chrome.runtime.sendMessage({
      action: commandKeys.clearChromeBadgeNotification
    }, (response) => {
    });
  }
}
