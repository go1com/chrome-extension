import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";
import {UserService} from "../../membership/services/user.service";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {commandKeys} from "../../../commandHandlers/commandKeys";

@Component({
  selector: 'app-new-discussion',
  templateUrl: './newDiscussionComponent.tpl.pug'
})
export class NewDiscussionComponent implements OnInit {
  isLoading: boolean;
  linkPreview: any;
  data: any;
  private pageUrl: any | string;
  newDiscussionFromBackgroundPage: boolean = false;
  mentionedUsers: any[] = [];

  constructor(private router: Router,
              private discussionService: DiscussionService,
              private currentActivatedRoute: ActivatedRoute,
              private userService: UserService,
              private storageService: StorageService) {
    let quotation = '';

    if (this.storageService.exists(configuration.constants.localStorageKeys.createNoteParams)) {
      const pageToCreateNote = this.storageService.retrieve(configuration.constants.localStorageKeys.createNoteParams);
      this.pageUrl = pageToCreateNote.url;
      quotation = pageToCreateNote.quotation || '';
      this.newDiscussionFromBackgroundPage = true;
    } else {
      this.pageUrl = configuration.currentChromeTab && configuration.currentChromeTab.url || '';
    }

    this.data = {
      title: '',
      body: '',
      entityType: 'portal',
      quote: quotation,
      item: this.pageUrl,
      entityId: storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId)
    };
  }

  async ngOnInit() {
    this.isLoading = true;
    this.data.user = await this.userService.getUser();

    this.linkPreview = await this.loadPageMetadata(this.pageUrl);
    this.isLoading = false;

    if (this.newDiscussionFromBackgroundPage) {
      window.onbeforeunload = () => {
        this.storageService.remove(configuration.constants.localStorageKeys.createNoteParams);
      };
    }
  }

  async ngOnDestroy() {
    this.storageService.remove(configuration.constants.localStorageKeys.createNoteParams);
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

    this.data.uniqueName = `${this.pageUrl}__`;
    const noteData = await this.discussionService.createNote(this.data);

    if (this.mentionedUsers.length) {
      let mentionedUserIds = this.mentionedUsers.map((user) => user.rootId.toString());
      await this.discussionService.mentionUsers(noteData.$uuid, mentionedUserIds);
    }

    if (this.newDiscussionFromBackgroundPage) {
      window.close();
      return;
    }

    await this.goBack();
  }
}
