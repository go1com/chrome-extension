import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {UserService} from '../services/user.service'

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit {
  user: any;
  errorMessage: string;
  loading = true;

  constructor(private userService: UserService, private router: Router) {
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
      const user = await this.userService.login(this.user);
      if (user.accounts.length > 1) {
        this.router.navigate(['/portals']);
      }

      if (user.accounts.length === 1) {
        this.redirect(user);
      }
    } catch (error) {
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
      const activeInstanceId = localStorage.getItem('activeInstance');
      const activeAccount = user.accounts.find(account => account.instance.id === activeInstanceId);

      if (activeAccount.roles.indexOf('administrator') >= 0) {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/discussions-list']);
      }
    } else {
      this.router.navigate(['']);
    }
  }
}
