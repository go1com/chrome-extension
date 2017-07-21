import {Component, OnDestroy, OnInit} from "@angular/core";
import {DiscussionService} from "../services/discussion.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-discussions-list',
  templateUrl: './discussionsList.component.html',
  styleUrls: ['./discussionsList.component.scss']
})
export class DiscussionsListComponent implements OnInit, OnDestroy {
  discussionsList: any[];

  constructor(private discussionService: DiscussionService,
              private router: Router,
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

  addToPortal() {

  }

  private async loadDiscussions() {
    const response = await this.discussionService.getUserNotesFromService();

    response.forEach(item => {
      this.discussionService.getUserNote(item.uuid).subscribe(note => {
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
      });
    });
  }
}
