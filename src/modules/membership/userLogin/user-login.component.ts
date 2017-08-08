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
    // check existing jwt to show login form or redirect to a router
    this.userService.currentUser.subscribe(
      user => {
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.redirect(user);
      }
    );
  }

  async login() {
    try {
      const user: any = await this.userService.login(this.user);
      // if (user.accounts.length > 1) {
      //   this.router.navigate(['/portals']);
      // }

      // if (user.accounts.length === 1) {
      this.redirect(user);
      // }
    } catch (error) {
      await this.modalDialogService.showAlert(
        error.message,
        'Error logging in'
      );
      this.errorMessage = error.message;
    }
  }

  register() {
    this.router.navigate(["/"]).then(result => {
      window.location.href = 'https://dev.mygo1.com/p';
    });
  }

  redirect(user): void {
    if (user.id) {
      const activeInstanceId = this.storageService.retrieve(configuration.constants.localStorageKeys.activeInstance);
      const activeAccount = user.accounts.find(account => account.instance.id === activeInstanceId);

      this.router.navigate(['/' + configuration.defaultPage]);
    } else {
      this.router.navigate(['']);
    }
  }
}
