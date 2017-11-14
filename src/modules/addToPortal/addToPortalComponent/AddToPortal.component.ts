import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {StorageService} from "../../go1core/services/StorageService";
import configuration from "../../../environments/configuration";
import {routeNames} from "../addToPortal.routes";
import {AddToPortalService} from "../services/AddToPortalService";
import {commandKeys} from "../../../environments/commandKeys";
import {ensureChromeTabLoaded} from "../../../environments/ensureChromeTabLoaded";
import {BrowserMessagingService} from "../../go1core/services/BrowserMessagingService";
import {DiscussionService} from "../../discussions/services/discussion.service";
import {UserService} from "../../membership/services/user.service";
import {PortalService} from "../../portal/services/PortalService";

@Component({
  selector: 'add-to-portal',
  templateUrl: './addToPortal.pug'
})
export class AddToPortalComponent implements OnInit, OnDestroy {
  user: any;
  portal: any;
  mentionedUsers: any[] = [];
  noteData: any;
  data: any;
  tabUrl = '';
  isLoading = false;
  linkPreview: any = null;
  addToPortalFromBackground = false;
  private pageUrl: any;
  learningItem: any;
  private currentPortalId: any;

  constructor(private router: Router,
              private addToPortalService: AddToPortalService,
              private discussionService: DiscussionService,
              private storageService: StorageService,
              private portalService: PortalService,
              private userService: UserService,
              private browserMessagingService: BrowserMessagingService) {

  }

  async ngOnInit() {
    this.isLoading = true;

    await Promise.all([
      this.portal = await this.portalService.getDefaultPortalInfo(),
      this.user = await this.userService.getUser()
    ]);

    if (!this.canAddToPortal()) {
      this.isLoading = false;
      return;
    }

    if (await this.storageService.exists(configuration.constants.localStorageKeys.addToPortalParams)) {
      const pageToCreateNote = await this.storageService.retrieve(configuration.constants.localStorageKeys.addToPortalParams);
      this.pageUrl = pageToCreateNote.url;
      this.addToPortalFromBackground = true;
      await this.storageService.remove(configuration.constants.localStorageKeys.addToPortalParams);
    } else {
      this.pageUrl = configuration.currentChromeTab && configuration.currentChromeTab.url || '';
    }

    const user = await this.storageService.retrieve(configuration.constants.localStorageKeys.user);
    this.currentPortalId = await this.storageService.retrieve(configuration.constants.localStorageKeys.currentActivePortalId)
    this.tabUrl = this.pageUrl;

    this.linkPreview = await this.loadPageMetadata(this.pageUrl);

    this.data = {
      title: this.linkPreview.title,
      description: this.linkPreview.description,
      type: 'iframe',
      tags: [],
      data: {
        path: this.pageUrl
      },
      single_li: true,
      published: 1,
      instance: this.currentPortalId,
      author: user.mail
    };

    this.noteData = {
      title: '',
      body: '',
      quote: '',
      item: this.pageUrl,
      entityType: configuration.constants.noteLiType,
      portalId: this.currentPortalId,
      context: {
        url: this.pageUrl,
        lo_status: configuration.constants.noteStatuses.PUBLIC_NOTE
      },
      private: 0,
      user: user
    };

    this.isLoading = false;
  }

  canAddToPortal() {
    if (!this.portal || !this.user) {
      return false;
    }

    if (this.portal.configuration.public_writing) {
      return true;
    }

    const currentPortalAccount = this.user.accounts.find(acc => acc.instance_name === this.portal.title);

    if (!currentPortalAccount) {
      return false;
    }

    return currentPortalAccount.roles.indexOf('administrator') > -1;
  }

  async ngOnDestroy() {
    // if (!_.isEqual(this.learningItem.tags, this.data.tags)) {
    //   await this.addToPortalService.updateLearningItem({
    //     id: this.learningItem.id,
    //     tags: this.learningItem.tags
    //   });
    // }
  }

  async onDoneBtnClicked() {
    this.learningItem = await this.addToPortal();

    if (this.noteData.body) {
      await this.addNote(this.learningItem.id);
    }

    await this.goToSuccess(this.learningItem.id);
  }


  async addNote(learningItemId: any) {
    if (!this.noteData.title) {
      this.noteData.title = 'Note from ' + this.linkPreview.title;
    }

    if (!this.noteData.body) {
      this.noteData.body = this.noteData.quote || 'Note from ' + this.linkPreview.title;
    }

    this.noteData.uniqueName = `${this.pageUrl}__${Math.floor(new Date().getTime() / 1000)}`;
    this.noteData.entityId = learningItemId;
    const noteData = await this.discussionService.createNote(this.noteData);

    if (this.mentionedUsers.length) {
      const mentionedUserIds = this.mentionedUsers.map((user) => user.rootId.toString());
      await this.discussionService.mentionUsers(noteData.$uuid, mentionedUserIds);
    }
  }

  async onCancelBtnClicked() {
    await this.goBack();
  }

  private async loadPageMetadata(url) {
    await ensureChromeTabLoaded();

    const response = await this.browserMessagingService.requestToTab(configuration.currentChromeTab.id, commandKeys.getLinkPreview);

    return response.data;
  }

  async addToPortal() {
    return await this.addToPortalService.addToPortal(this.data);
  }

  async goToSuccess(learningItemId) {
    await this.router.navigate(['./', configuration.pages.addToPortal, routeNames.success, learningItemId]);
  }

  goBack() {
    this.router.navigate(['/' + configuration.defaultPage]);
  }
}
