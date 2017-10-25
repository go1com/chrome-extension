import {Component} from "@angular/core";
import {commandKeys} from "../../../environments/commandKeys";
import {BackgroundNotificationService} from "../../../sharedComponents/backgrounNotification/backgroundNotification.service";
import configuration from "../../../environments/configuration";
import {StorageService} from "../../go1core/services/StorageService";

@Component({
  selector: 'notification-component',
  templateUrl: './notification.component.pug'
})
export class NotificationComponent {
  messages: any[];
  loading: boolean = false;

  constructor(private backgroundNotificationService: BackgroundNotificationService,
              private storageService: StorageService) {
    this.messages = [];
  }

  async ngOnInit() {
    this.loading = true;
    const user = this.storageService.retrieve(configuration.constants.localStorageKeys.user);
    if (!user || !user.profile_id)
      return;

    const userProfileId = user.profile_id;
    await this.backgroundNotificationService.initialize(userProfileId);
    this.loading = false;
  }

  ngAfterViewInit() {
    chrome.runtime.sendMessage({
      action: commandKeys.clearChromeBadgeNotification
    }, (response) => {
    });
  }

  getMessages() {
    return this.backgroundNotificationService.getMessages();
  }
}
