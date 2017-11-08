import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {DiscussionService} from "../services/discussion.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PortalService} from "../../portal/services/PortalService";
import configuration from "../../../environments/configuration";
import {UserService} from "../../membership/services/user.service";
import * as _ from 'lodash';
import {StorageService} from "../../go1core/services/StorageService";
import {ensureChromeTabLoaded} from "../../../environments/ensureChromeTabLoaded";


const discussionListKey = 'DISCUSSION_LIST_CACHED';

@Component({
  selector: 'app-discussions-list',
  templateUrl: './discussionsList.component.pug'
})
export class DiscussionsListComponent implements OnInit, OnDestroy {
  onNoteDeletedEvent: any;
  onNoteCreatedEvent: any;
  discussionsList: any[];
  loading = false;
  portal: any;
  changePortalId = '';
  private user: any;
  private loadingTimeout: any;

  constructor(private discussionService: DiscussionService,
              private router: Router,
              private portalService: PortalService,
              private userService: UserService,
              private zone: NgZone,
              private storageService: StorageService,
              private currentActivatedRoute: ActivatedRoute) {
    this.discussionsList = [];
    this.onNoteCreatedEvent = discussionService.onNoteCreated.subscribe(() => this.loadDiscussions());
    this.onNoteDeletedEvent = discussionService.onNoteDeleted.subscribe((noteUuid) => this.removeNote(noteUuid));
    this.portal = null;
  }

  async ngOnInit() {
    await ensureChromeTabLoaded();
    this.loading = true;
    this.discussionsList = [];
    await this.loadDiscussions();
    this.portalService.getDefaultPortalInfo().then(portal => {
      this.portal = portal;
    });
    this.userService.getUser().then(user => {
      this.user = user;
    });
    this.changePortalId = '';
  }

  async onPortalChanged(portalId) {
    this.portal = await this.portalService.getPortal(portalId);
    this.portalService.setDefaultPortal(this.portal);
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

  ngOnDestroy(): void {
    this.onNoteCreatedEvent.unsubscribe();
    this.onNoteDeletedEvent.unsubscribe();
  }

  async addDiscussion() {
    await this.router.navigate([configuration.pages.discussionModule, configuration.pages.newDiscussion], {relativeTo: this.currentActivatedRoute});
  }

  async addToPortal() {
    await this.router.navigate([configuration.pages.addToPortalModule, configuration.pages.addToPortal]);
  }

  private async removeNote(noteUuid) {
    this.discussionsList = this.discussionsList.filter(discussionTopic => discussionTopic.uuid !== noteUuid);
  }

  notesToShow() {
    return _.sortBy(this.discussionsList.filter(discussionTopic => discussionTopic.item === configuration.currentChromeTab.url), 'created')
      .reverse();
  }

  private async loadDiscussions() {
    if (!this.discussionsList.length) {
      this.loading = true;
    }

    const response = await this.discussionService.getUserNotesFromService(configuration.currentChromeTab.url);

    if (!response.length) {
      this.discussionsList = [];
      this.zone.run(() => this.closeLoading(1000));
      return;
    }

    for (let i = 0; i < response.length; i++) {
      const noteItem = response[i];

      this.discussionService.subscribeUserNote(noteItem.uuid)
        .subscribe((note: any) => {
          if (!note || !note.data) {
            return;
          }
          this.onNoteReceived(noteItem, note);
        });

      if (i === 0) {
        this.zone.run(() => this.closeLoading(1000));
      }
    }
  }

  closeLoading(timeout = 750) {
    this.loadingTimeout = setTimeout(() => {
      this.loading = false;
    }, timeout);
  }

  onNoteReceived(noteItem: any, noteData: any) {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }

    let discussionTopic: any = this.discussionsList.find(discussion => discussion.uuid === noteItem.uuid);
    if (discussionTopic == null) {
      discussionTopic = {
        uuid: noteItem.uuid,
        noteItem: noteItem,
        messages: []
      };
      this.discussionsList.push(discussionTopic);
    }

    const keys = Object.keys(noteData.data);

    let foundIndex: any = -1;
    keys.forEach((key, index) => {
      if (foundIndex > -1) {
        return;
      }

      const tmpDiscussionTopic = noteData.data[key];
      tmpDiscussionTopic.$id = key;

      if (tmpDiscussionTopic.item === configuration.currentChromeTab.url) {
        discussionTopic.item = tmpDiscussionTopic.item;
        discussionTopic.quote = tmpDiscussionTopic.quote;
        discussionTopic.user_id = tmpDiscussionTopic.user_id;
        discussionTopic.message = tmpDiscussionTopic.message;
        discussionTopic.created = tmpDiscussionTopic.created;
        discussionTopic.name = tmpDiscussionTopic.name;
        foundIndex = index;
      }
    });

    discussionTopic.messages = [];

    for (let index = 0; index < keys.length; index++) {
      if (index !== foundIndex) {
        const messageData = noteData.data[keys[index]];
        messageData.$id = keys[index];

        discussionTopic.messages.push(messageData);
      }
    }

    this.zone.run(() => this.closeLoading());
  }
}
