import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";
import {UserService} from "../../membership/services/user.service";
import {Go1RuntimeContainer} from "../../go1core/services/go1RuntimeContainer";
import {StorageService} from "../../go1core/services/StorageService";
import {environment} from "../../../environments";

@Component({
  selector: 'app-new-discussion',
  templateUrl: '../../../views/newDiscussionComponent.tpl.pug'
})
export class NewDiscussionComponent implements OnInit {
  data: any;

  constructor(private router: Router,
              private discussionService: DiscussionService,
              private currentActivatedRoute: ActivatedRoute,
              private userService: UserService,
              private storageService: StorageService) {
    this.data = {
      title: '',
      body: '',
      entityType: 'portal',
      quote: '',
      item: Go1RuntimeContainer.currentChromeTab.url,
      entityId: storageService.retrieve(environment.constants.localStorageKeys.portalInstance)
    };
  }

  async ngOnInit() {
    this.data.user = this.userService.getUser();
  }

  async goBack() {
    this.router.navigate(['../'], {relativeTo: this.currentActivatedRoute});
  }

  async addNote() {
    if (!this.data.title) {
      alert('Please enter the topic!');
      return;
    }
    await this.discussionService.createNote(this.data);
    await this.goBack();
  }
}
