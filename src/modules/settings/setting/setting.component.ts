import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../membership/services/user.service';
import {StorageService} from "../../go1core/services/StorageService";
import {environment} from "../../../environments";
import configuration from "../../../environments/configuration";
import {commandKeys} from "../../../commandHandlers/commandKeys";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.pug',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  private user;
  private quickButtonEnabled: boolean;

  constructor(private userService: UserService,
              private storageService: StorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.quickButtonEnabled = this.storageService.retrieve(configuration.constants.localStorageKeys.quickButtonSetting) || false;

    this.userService.currentUser.subscribe(
      (user) => {
        this.user = user;
      }
    );
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
    this.router.navigate(['/']);
  }
}
