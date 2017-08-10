import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../membership/services/user.service';
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {commandKeys} from "../../../commandHandlers/commandKeys";
import {PortalService} from "../../portal/services/PortalService";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.pug',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  defaultPortal: any;
  private user;
  private userAvatar;
  private quickButtonEnabled: boolean;

  constructor(private userService: UserService,
              private storageService: StorageService,
              private portalService: PortalService,
              private router: Router) {
    this.userAvatar = null;
    this.user = {};
    this.defaultPortal = null;
  }

  async ngOnInit() {
    this.quickButtonEnabled = this.storageService.retrieve(configuration.constants.localStorageKeys.quickButtonSetting) || false;
    this.defaultPortal = this.portalService.getDefaultPortalSetting();
    console.log(this.defaultPortal);

    this.user = await this.userService.getUser();
    this.userAvatar = this.user.avatar && this.user.avatar.uri;

    if (this.userAvatar && !this.userAvatar.startsWith('https') && !this.userAvatar.startsWith('http:')) {
      this.userAvatar = 'https:' + this.userAvatar;
    }
  }

  async changeDefaultPortal(defaultPortal) {
    const portal = await this.portalService.getPortal(defaultPortal);
    this.portalService.setDefaultPortal(portal);
  }

  toggleQuickButton() {
    this.quickButtonEnabled = !this.quickButtonEnabled;

    this.storageService.store(configuration.constants.localStorageKeys.quickButtonSetting, this.quickButtonEnabled);

    chrome.tabs.query({currentWindow: true}, function (tabs) {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          name: commandKeys.checkQuickButtonSettings
        }, function (response) {

        });
      });
    });
  }

  signout() {
    this.userService.logout();
    this.router.navigate(['/membership/login']);
  }
}
