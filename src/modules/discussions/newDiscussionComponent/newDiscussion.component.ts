import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";
import {UserService} from "../../membership/services/user.service";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {commandKeys} from "../../../environments/commandKeys";
import {ensureChromeTabLoaded} from "../../../environments/ensureChromeTabLoaded";
import {BrowserMessagingService} from "../../go1core/services/BrowserMessagingService";

@Component({
  selector: 'app-new-discussion',
  templateUrl: './newDiscussionComponent.tpl.pug'
})
export class NewDiscussionComponent implements OnInit, OnDestroy {
  currentPortalId: any;
  noteStatus: any = configuration.constants.noteStatuses.PUBLIC_NOTE;
  isLoading: boolean;
  linkPreview: any;
  data: any;
  private pageUrl: any | string;
  newDiscussionFromBackgroundPage = false;
  mentionedUsers: any[] = [];
  privacySetting = 'ONLYME';

  constructor(private router: Router,
              private discussionService: DiscussionService,
              private currentActivatedRoute: ActivatedRoute,
              private userService: UserService,
              private browserMessagingService: BrowserMessagingService,
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

    this.currentPortalId = storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);
    this.data = {
      title: '',
      body: '',
      quote: quotation,
      item: this.pageUrl,
      entityType: configuration.constants.noteChromeExtType,
      entityId: Math.floor(new Date().getTime() / 1000),
      portalId: this.currentPortalId,
      context: {
        url: this.pageUrl,
        lo_status: this.noteStatus || configuration.constants.noteStatuses.PUBLIC_NOTE
      },
      private: 1
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

  onPrivacyChange() {
    if (this.privacySetting === 'ONLYME' || this.privacySetting === 'MENTIONED') {
      this.data.entityType = configuration.constants.noteChromeExtType;
      this.data.entityId = Math.floor(new Date().getTime() / 1000);
      this.data.private = 1;
      return;
    }

    if (this.privacySetting === 'PUBLIC') {
      this.data.entityType = configuration.constants.notePortalType;
      this.data.entityId = this.currentPortalId;
      this.data.private = 0;
    }
  }

  private async loadPageMetadata(url) {
    await ensureChromeTabLoaded();

    const response = await this.browserMessagingService.requestToTab(configuration.currentChromeTab.id, commandKeys.getLinkPreview);

    return response.data;
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
        action: commandKeys.closeExtensionPopup
      }, async (response) => {
      });
    }

    await this.goBack();
  }
}
