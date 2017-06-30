/// <reference types="chrome" />

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LearnerService } from './learner.service';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-learner-dashboard',
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.css']
})

export class LearnerDashboardComponent implements OnInit {
  private awards: Array<any>;
  private user;
  private activeInstance;
  private loading: boolean = true;
  private submitting: boolean = false;
  private currentUrl: string;
  private selectedAward;
  private learning: any = {};

  constructor(
    private learnerService: LearnerService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.learnerService.getLearnerAwards()
      .subscribe(awards => {
        this.awards = awards;
        if (this.awards.length > 0) {
          this.selectedAward = this.awards[0];
        }
        this.loading = false;
      });

    this.userService.currentUser.subscribe( (user) => {
      this.user = user;

      if (user.id) {
        if (user.accounts.length > 1) {
          this.activeInstance = user.accounts.find(account => {
            return account.instance.id = localStorage.getItem('activeInstance');
          }).instance;
        }
      }
    });

    try {
      chrome.tabs.getSelected(null, tab => this.learning.description = `I've read ${ tab.url }`);
    }
    catch (ex) {
      this.learning.description = `I've read ...`
    }
  }

  onChangeAward(event) {
    console.log(this.selectedAward);
  }

  submit() {
    this.submitting = true;
    this.learnerService.recordLearning(this.selectedAward, this.learning).subscribe(
      () => {
        this.submitting = false;

        this.router.navigate(['/complete'], {queryParams:
            {
              title: 'Learning recorded',
              redirectMask:'View your learning history',
              redirect: `http://dev.mygo1.com/p/#/token?token=${ this.user.uuid }&destination=app/award/${this.selectedAward.id}`
            }
          });
      }
    );
  }
}
