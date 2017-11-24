import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DiscussionService } from "../services/discussion.service";
import { UserService } from "../../membership/services/user.service";
import { StorageService } from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import { commandKeys } from "../../../environments/commandKeys";
import { ensureChromeTabLoaded } from "../../../environments/ensureChromeTabLoaded";
import { BrowserMessagingService } from "../../go1core/services/BrowserMessagingService";
import { EllipsisService } from "../../go1core/ellipsis-pipe/ellipsis.pipe";

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
    private ellipsisService: EllipsisService,
    private storageService: StorageService) {
  }

  async ngOnInit() {
    this.isLoading = true;
    const user = await this.userService.getUser();

    if (!user) {
      await this.storageService.store('redirectAfterLoggedIn', this.router.url);
      await this.router.navigate(['membership/login']);
      return;
    }

    let quotation = '';
    let quotationPosition = null;

    const hasCreateNoteParams = await this.storageService.exists(configuration.constants.localStorageKeys.createNoteParams);

    if (hasCreateNoteParams) {
      const pageToCreateNote = await this.storageService.retrieve(configuration.constants.localStorageKeys.createNoteParams);
      this.pageUrl = pageToCreateNote.url;
      this.noteStatus = pageToCreateNote.lo_status; // public/private;
      quotation = pageToCreateNote.quotation || '';
      quotationPosition = pageToCreateNote.quotationPosition || null;
      await this.storageService.remove(configuration.constants.localStorageKeys.createNoteParams);
      this.newDiscussionFromBackgroundPage = true;
    } else {
      this.pageUrl = configuration.currentChromeTab && configuration.currentChromeTab.url || '';
    }

    this.currentPortalId = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId);

    if (this.pageUrl.indexOf('#') > -1) {
      this.pageUrl = this.pageUrl.substr(0, this.pageUrl.indexOf('#'));
    }

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
      private: 1,
      user: user
    };

    if (quotation) {
      this.data.quote = quotation;
      this.data.context.quotation = quotation;
      this.data.context.quotationPosition = quotationPosition;
    }

    this.linkPreview = await this.loadPageMetadata(this.pageUrl);
    this.isLoading = false;
    console.log(this.data);
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
    await this.router.navigate(['../'], { relativeTo: this.currentActivatedRoute });
  }

  onTextChanged() {
    if (this.mentionedUsers.length) {
      this.privacySetting = 'MENTIONED';
    }
  }

  async addNote() {
    if (!this.data.title) {
      this.data.title = 'Note from ' + this.linkPreview.title;
    }

    if (!this.data.body) {
      this.data.body = this.data.quote || 'Note from ' + this.linkPreview.title;
    }

    if (this.data.quotation) {
      this.data.body = `<blockquote>${this.data.quotation}</blockquote>` + this.data.body;
    }

    this.data.uniqueName = `${this.pageUrl}__${Math.floor(new Date().getTime() / 1000)}`;
    const noteData = await this.discussionService.createNote(this.data);

    if (this.mentionedUsers.length) {
      this.privacySetting = 'MENTIONED';
      const mentionedUserIds = this.mentionedUsers.map((user) => user.rootId.toString());
      await this.discussionService.mentionUsers(noteData.$uuid, mentionedUserIds);
    }

    if (this.newDiscussionFromBackgroundPage) {
      await this.browserMessagingService.requestToTab(configuration.currentChromeTab.id, commandKeys.closeExtensionPopup);
    }

    await this.goBack();
  }
}
