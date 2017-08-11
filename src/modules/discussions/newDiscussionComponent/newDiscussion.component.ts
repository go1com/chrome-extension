import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";
import {UserService} from "../../membership/services/user.service";
import {Go1RuntimeContainer} from "../../go1core/services/go1RuntimeContainer";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {commandKeys} from "../../../commandHandlers/commandKeys";

@Component({
  selector: 'app-new-discussion',
  templateUrl: '../../../views/newDiscussionComponent.tpl.pug'
})
export class NewDiscussionComponent implements OnInit {
  isLoading: boolean;
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
    this.isLoading = true;
    this.data.user = await this.userService.getUser();

    this.linkPreview = await this.loadPageMetadata(Go1RuntimeContainer.currentChromeTab.url);
    this.isLoading = false;
  }

  private async loadPageMetadata(url) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: commandKeys.getLinkPreview,
        data: url
      }, (response) => {
        resolve(response.data);
      });
    });
  }

  async goBack() {
    this.router.navigate(['../'], {relativeTo: this.currentActivatedRoute});
  }

  async addNote() {
    if (!this.data.title) {
      this.data.title = 'Note from ' + this.linkPreview.title;
    }

    this.data.uniqueName = `${Go1RuntimeContainer.currentChromeTab.url}__`;
    await this.discussionService.createNote(this.data);
    await this.goBack();
  }
}
