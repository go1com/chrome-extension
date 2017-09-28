import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import configuration from "../environments/configuration";
import {UserService} from "../modules/membership/services/user.service";
import {Router} from "@angular/router";
import {StorageService} from "../modules/go1core/services/StorageService";

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'GO1 bookmark';

  constructor(private userService: UserService,
              private storageService: StorageService,
              private router: Router) {
  }

  async ngOnInit() {
    if (window.name === configuration.constants.popupDefaultName) {
      $('body').addClass('go1-popup');
    }

    if (this.storageService.retrieve(configuration.constants.localStorageKeys.socialLogin)) {
      return;
    }

    if (this.userService.isLoggedIn()) {
      if (this.storageService.exists(configuration.constants.localStorageKeys.createNoteParams)) {
        this.router.navigate([configuration.pages.discussionModule, configuration.pages.newDiscussion]);
        return;
      }

      if (this.storageService.exists(configuration.constants.localStorageKeys.addToPortalParams)) {
        this.router.navigate([configuration.pages.addToPortalModule, configuration.pages.addToPortal]);
        return;
      }

      this.router.navigate(['/' + configuration.defaultPage]);
      return;
    }

    this.router.navigate(['/membership/login']);
  }
}
