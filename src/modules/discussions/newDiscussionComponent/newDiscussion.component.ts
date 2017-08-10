import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";
import {UserService} from "../../membership/services/user.service";
import {Go1RuntimeContainer} from "../../go1core/services/go1RuntimeContainer";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";

@Component({
  selector: 'app-new-discussion',
  templateUrl: '../../../views/newDiscussionComponent.tpl.pug'
})
export class NewDiscussionComponent implements OnInit {
  linkPreview: any;
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
      item: Go1RuntimeContainer.currentChromeTab && Go1RuntimeContainer.currentChromeTab.url || '',
      entityId: storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId)
    };
  }

  async ngOnInit() {
    this.data.user = await this.userService.getUser();

    if (!this.data.item) {
      return new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          Go1RuntimeContainer.currentChromeTab = tabs[0];
          this.data.item = Go1RuntimeContainer.currentChromeTab.url;
          resolve();
        });
      });
    }
  }

  async goBack() {
    this.router.navigate(['../'], {relativeTo: this.currentActivatedRoute});
  }

  async addNote() {
    if (!this.data.title) {
      this.data.title = 'Note from ' + this.linkPreview.title;
    }
    await this.discussionService.createNote(this.data);
    await this.goBack();
  }
}
