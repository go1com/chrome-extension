import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {UserService} from '../services/user.service'
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {ModalDialogService} from "../../go1core/services/ModalDialogService";

declare const $: any;

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.pug'
})

export class UserLoginComponent implements OnInit {
  loggingIn: boolean;
  user: any;
  errorMessage: string;
  loading = true;

  constructor(private userService: UserService,
              private storageService: StorageService,
              private modalDialogService: ModalDialogService,
              private router: Router) {
  }

  ngOnInit() {
    this.user = {};

    this.loading = false;
  }

  async login() {
    try {
      this.loggingIn = true;
      const user: any = await this.userService.login(this.user);
      await this.redirect(user);
    } catch (error) {
      await this.modalDialogService.showAlert(
        error.message,
        'Error logging in'
      );
      this.errorMessage = error.message;
    } finally {
      this.loggingIn = false;
    }
  }

  onInputKeyDown(event) {
    if (event.code === 'Tab') {
      const tabIndex = parseInt(($(event.target).attr('tabindex')), 10);
      if ($(`[tabindex="${tabIndex + 1}"]`).length) {
        $(`[tabindex="${tabIndex + 1}"]`).focus();
        event.preventDefault();
      }
    }
  }

  async facebookLogIn() {
    this.router.navigate(['/' + configuration.pages.fbLogin]);
  }

  async googleLogin() {
    this.router.navigate(['/' + configuration.pages.ggLogin]);
  }

  async redirect(user): Promise<void> {
    if (user.id) {
      const activeInstanceId = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);
      const activeAccount = user.accounts.find(account => account.instance.id === activeInstanceId);

      const pageToNavigate = await this.storageService.retrieve('redirectAfterLoggedIn') || '/' + configuration.defaultPage;

      await this.router.navigate([pageToNavigate]);
      await this.storageService.remove('redirectAfterLoggedIn');
    }
  }
}
