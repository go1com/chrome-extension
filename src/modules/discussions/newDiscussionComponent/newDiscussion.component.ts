import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";
import {UserService} from "../../membership/services/user.service";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {commandKeys} from "../../../commandHandlers/commandKeys";
import {ensureChromeTabLoaded} from "../../../environments/ensureChromeTabLoaded";

@Component({
  selector: 'app-new-discussion',
  templateUrl: './newDiscussionComponent.tpl.pug'
})
export class NewDiscussionComponent implements OnInit {
  noteStatus: any = configuration.constants.noteStatuses.PUBLIC_NOTE;
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
    let quotationPosition = null;

    if (this.storageService.exists(configuration.constants.localStorageKeys.createNoteParams)) {
      const pageToCreateNote = this.storageService.retrieve(configuration.constants.localStorageKeys.createNoteParams);
      this.pageUrl = pageToCreateNote.url;
      this.noteStatus = pageToCreateNote.lo_status; // public/private;
      quotation = pageToCreateNote.quotation || '';
      quotationPosition = pageToCreateNote.quotationPosition || null;
      this.storageService.remove(configuration.constants.localStorageKeys.createNoteParams);
      this.newDiscussionFromBackgroundPage = true;
    } else {
      this.pageUrl = configuration.currentChromeTab && configuration.currentChromeTab.url || '';
    }

    this.data = {
      title: '',
      body: '',
      quote: quotation,
      item: this.pageUrl,
      entityType: configuration.constants.noteChromeExtType,
      entityId: Math.floor(new Date().getTime() / 1000),
      portalId: storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId),
      context: {
        url: this.pageUrl,
        lo_status: this.noteStatus || configuration.constants.noteStatuses.PUBLIC_NOTE
      }
    };

    if (quotation) {
      this.data.quote = quotation;
      this.data.context.quotation = quotation;
      this.data.context.quotationPosition = quotationPosition;
    }
  }

  async ngOnInit() {
    this.isLoading = true;
    this.data.user = await this.userService.getUser();

    this.linkPreview = await this.loadPageMetadata(this.pageUrl);
    this.isLoading = false;
  }

  async ngOnDestroy() {
  }

  private async loadPageMetadata(url) {
    await ensureChromeTabLoaded();

    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(configuration.currentChromeTab.id, {
        name: commandKeys.getLinkPreview
      }, function (response) {
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

    if (!this.data.body) {
      this.data.body = this.data.quote || 'Note from ' + this.linkPreview.title;
    }

    this.data.uniqueName = `${this.pageUrl}__`;
    const noteData = await this.discussionService.createNote(this.data);

    if (this.mentionedUsers.length) {
      const mentionedUserIds = this.mentionedUsers.map((user) => user.rootId.toString());
      await this.discussionService.mentionUsers(noteData.$uuid, mentionedUserIds);
    }

    if (this.newDiscussionFromBackgroundPage) {
      chrome.tabs.sendMessage(configuration.currentChromeTab.id, {
        name: commandKeys.closeExtensionPopup
      }, async (response) => {
      });
    }

    await this.goBack();
  }
}
