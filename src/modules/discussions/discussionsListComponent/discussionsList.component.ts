import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {DiscussionService} from "../services/discussion.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PortalService} from "../../portal/services/PortalService";
import configuration from "../../../environments/configuration";

@Component({
  selector: 'app-discussions-list',
  templateUrl: './discussionsList.component.pug'
})
export class DiscussionsListComponent implements OnInit, OnDestroy {
  onNoteDeletedEvent: any;
  onNoteCreatedEvent: any;
  discussionsList: any[];
  loading: boolean = false;
  portal: any;
  changePortalId: string = '';

  constructor(private discussionService: DiscussionService,
              private router: Router,
              private portalService: PortalService,
              private zone: NgZone,
              private currentActivatedRoute: ActivatedRoute) {
    this.discussionsList = [];
    this.onNoteCreatedEvent = discussionService.onNoteCreated.subscribe(() => this.loadDiscussions());
    this.onNoteDeletedEvent = discussionService.onNoteDeleted.subscribe((noteUuid) => this.removeNote(noteUuid));
    this.portal = null;
  }

  async ngOnInit() {
    await this.loadDiscussions();
    this.portal = await this.portalService.getDefaultPortalInfo();
    this.changePortalId = '';
  }

  async onPortalChanged(portalId) {
    this.portal = await this.portalService.getPortal(portalId);
    this.portalService.setDefaultPortal(this.portal);
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
    this.discussionsList = this.discussionsList.filter(discussionTopic => discussionTopic.noteItem.uuid !== noteUuid);
  }

  private async loadDiscussions() {
    this.loading = true;
    this.discussionsList = [];
    const response = await this.discussionService.getUserNotesFromService();

    for (let i = 0; i < response.length; i++) {
      const noteItem = response[i];
      const note: any = await this.discussionService.getUserNote(noteItem.uuid);

      if (!note || !note.data) {
        continue;
      }

      const keys = Object.keys(note.data);

      let discussionTopic: any = null;
      let foundIndex: any = -1;
      keys.forEach((key, index) => {
        if (discussionTopic)
          return;

        let tmpDiscussionTopic = note.data[key];
        tmpDiscussionTopic.$id = key;

        if (tmpDiscussionTopic.item === configuration.currentChromeTab.url) {
          discussionTopic = tmpDiscussionTopic;
          foundIndex = index;
        }
      });

      if (!discussionTopic) {
        continue;
      }

      discussionTopic.noteItem = noteItem;

      discussionTopic.messages = [];

      for (let index = 0; index < keys.length; index++) {
        if (index != foundIndex) {
          let messageData = note.data[keys[index]];
          messageData.$id = keys[index];

          discussionTopic.messages.push(messageData);
        }
      }

      this.discussionsList.push(discussionTopic);
    }

    this.zone.run(() => {
      this.loading = false;
    });
  }
}
