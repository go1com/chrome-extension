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
    await this.router.navigate(['/', configuration.pages.discussionsList, 'newDiscussion'], {relativeTo: this.currentActivatedRoute});
  }

  async addToPortal() {
    await this.router.navigate(['/', configuration.pages.addToPortal, configuration.pages.addToPortal]);
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
      const discussionTopic: any = note.data[keys[0]];

      // only load items that belong to current page.
      if (discussionTopic.item !== configuration.currentChromeTab.url)
        continue;

      discussionTopic.noteItem = noteItem;

      if (!discussionTopic) {
        continue;
      }

      discussionTopic.messages = [];

      for (let index = 1; index < keys.length; index++) {
        discussionTopic.messages.push(note.data[keys[index]]);
      }

      this.discussionsList.push(discussionTopic);
    }
    this.zone.run(() => {
      this.loading = false;
    });
  }
}
