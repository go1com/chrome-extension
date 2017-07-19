import {Component, OnDestroy, OnInit} from "@angular/core";
import {DiscussionService} from "../services/discussion.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-discussions-list',
  templateUrl: './discussionsList.component.html',
  styleUrls: ['./discussionsList.component.css']
})
export class DiscussionsListComponent implements OnInit, OnDestroy {
  discussionsList: any[];

  constructor(private discussionService: DiscussionService,
              private router: Router, private currentActivatedRoute: ActivatedRoute) {
    this.discussionsList = [];
  }

  async ngOnInit() {
    this.discussionsList = await this.discussionService.getUserNotes();
  }

  ngOnDestroy(): void {
  }

  async addDiscussion() {
    await this.router.navigate(['./newDiscussion'], { relativeTo: this.currentActivatedRoute});
  }
}
