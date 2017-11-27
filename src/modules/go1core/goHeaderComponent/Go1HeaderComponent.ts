import { Component, Input, OnInit } from "@angular/core";
import configuration from "../../../environments/configuration";
import {commandKeys} from "../../../environments/commandKeys";

@Component({
  selector: 'go-header',
  templateUrl: './goHeader.tpl.pug'
})
export class Go1HeaderComponent implements OnInit{
  @Input() activePage: string;
  @Input() title: string;

  notificationUnreadCount = 0;

  constructor() {
  }

  canShowBackAndSetting() {
    const canShowBackAndSettings = window.name === configuration.constants.popupDefaultName;

    return canShowBackAndSettings;
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
