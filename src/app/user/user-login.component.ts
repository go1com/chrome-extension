import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service'

@Component( {
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: [ './user-login.component.css' ]
})

export class UserLoginComponent implements OnInit {
  user: any;
  errorMessage: string;
  loading: boolean = true;

  constructor(private userService: UserService, private router:Router) { }

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

  login(): void {
    this.userService.login(this.user)
      .subscribe(
        user => {
          console.log(user);
          if (user.accounts.length > 1) {
            this.router.navigate(['/portals']);
          }

          if (user.accounts.length === 1) {
            this.redirect(user);
          }
        },
        error => this.errorMessage = error.message
      );
  }

  redirect(user) :void {
    if (user.id) {
      const activeInstanceId = localStorage.getItem('activeInstance');
      const activeAccount = user.accounts.find( account => account.instance.id === activeInstanceId );

      if (activeAccount.roles.indexOf('administrator') >= 0) {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/learner-dashboard']);
      }
    } else {
      this.router.navigate(['']);
    }
  }
}
