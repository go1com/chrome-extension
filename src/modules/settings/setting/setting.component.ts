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
  versionInfo: string = configuration.version;
  defaultPortal: any;
  private user;
  private userAvatar;
  private quickButtonEnabled: boolean;
  private createNoteEnabled: boolean;
  private highlightNotesEnabled: boolean;
  private currentYear: number;

  constructor(private userService: UserService,
              private storageService: StorageService,
              private portalService: PortalService,
              private router: Router) {
    this.userAvatar = null;
    this.user = {};
    this.defaultPortal = null;
    this.currentYear = new Date().getFullYear();
  }

  async ngOnInit() {
    this.quickButtonEnabled = this.storageService.retrieve(configuration.constants.localStorageKeys.quickButtonSetting) || false;
    this.createNoteEnabled = this.storageService.retrieve(configuration.constants.localStorageKeys.createNoteSetting) || false;
    this.highlightNotesEnabled = this.storageService.retrieve(configuration.constants.localStorageKeys.highlightNoteSetting) || false;

    this.defaultPortal = this.portalService.getDefaultPortalSetting();

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

    chrome.tabs.query({currentWindow: true}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          name: commandKeys.checkQuickButtonSettings
        }, function (response) {

        });
      });
    });
  }

  toggleCreateNoteToolTip() {
    this.createNoteEnabled = !this.createNoteEnabled;

    this.storageService.store(configuration.constants.localStorageKeys.createNoteSetting, this.createNoteEnabled);

    chrome.tabs.query({currentWindow: true}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          name: commandKeys.checkCreateNoteSettings
        }, function (response) {

        });
      });
    });
  }

  toggleHighlightNotes() {
    this.highlightNotesEnabled = !this.highlightNotesEnabled;

    this.storageService.store(configuration.constants.localStorageKeys.highlightNoteSetting, this.highlightNotesEnabled);

    chrome.tabs.query({currentWindow: true}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          name: commandKeys.checkHighlightNoteSettings
        }, function (response) {

        });
      });
    });
  }

  async signout() {
    this.userService.logout();
    await this.router.navigate(['/membership/login']);
  }
}
