import {Component, Input} from "@angular/core";
import configuration from "../../../environments/configuration";
import {commandKeys} from "../../../environments/commandKeys";

@Component({
  selector: 'go-header',
  templateUrl: './goHeader.tpl.pug'
})
export class Go1HeaderComponent {
  @Input() activePage: string;
  @Input() title: string;

  notificationUnreadCount: number = 0;

  constructor() {
  }

  canShowBackAndSetting() {
    return window.name !== configuration.constants.popupDefaultName;
  }

  ngOnInit() {
    this.getNotificationCount();
  }

  getNotificationCount() {
    chrome.runtime.sendMessage({
      action: commandKeys.countNotificationMessages
    }, (response) => {
      this.notificationUnreadCount = response.data;

      setTimeout(() => this.getNotificationCount(), 5000);
    });
  }
}
