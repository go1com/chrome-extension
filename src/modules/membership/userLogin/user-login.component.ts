import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {UserService} from '../services/user.service'
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {ModalDialogService} from "../../go1core/services/ModalDialogService";

@Component({
  selector: 'user-login',
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
      this.redirect(user);
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

  async facebookLogIn() {
    this.storageService.store(configuration.constants.localStorageKeys.socialLogin, true);

    window.open(`${configuration.constants.indexPage}#${configuration.pages.fbLogin}`);
  }

  async googleLogin() {
    this.storageService.store(configuration.constants.localStorageKeys.socialLogin, true);

    window.open(`${configuration.constants.indexPage}#${configuration.pages.ggLogin}`);
  }

  redirect(user): void {
    if (user.id) {
      const activeInstanceId = this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);
      const activeAccount = user.accounts.find(account => account.instance.id === activeInstanceId);

      this.router.navigate(['/' + configuration.defaultPage]);
    }
  }
}
