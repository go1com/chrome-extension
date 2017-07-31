import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {DiscussionService} from "../services/discussion.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-discussions-list',
  templateUrl: './discussionsList.component.pug',
  styleUrls: ['./discussionsList.component.scss']
})
export class DiscussionsListComponent implements OnInit, OnDestroy {
  discussionsList: any[];
  loading: boolean = false;

  constructor(private discussionService: DiscussionService,
              private router: Router,
              private zone: NgZone,
              private currentActivatedRoute: ActivatedRoute) {
    this.discussionsList = [];
  }

  async ngOnInit() {
    await this.loadDiscussions();
  }

  ngOnDestroy(): void {
  }

  async addDiscussion() {
    await this.router.navigate(['./newDiscussion'], {relativeTo: this.currentActivatedRoute});
  }

  async addToPortal() {
    await this.router.navigate(['/addToPortal']);
  }

  private async loadDiscussions() {
    this.loading = true;
    const response = await this.discussionService.getUserNotesFromService();

    for (let i = 0; i < response.length; i++) {
      const item = response[i];
      const note: any = await this.discussionService.getUserNote(item.uuid);
      if (!note || !note.data) {
        return;
      }

      const keys = Object.keys(note.data);
      const discussionTopic = note.data[keys[0]];

      if (!discussionTopic) {
        return;
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
