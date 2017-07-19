import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";

@Component({
  selector: 'app-new-discussion',
  templateUrl: './newDiscussion.component.html',
  styleUrls: ['./newDiscussion.component.scss']
})
export class NewDiscussionComponent implements OnInit {
  data: any;

  constructor(private router: Router,
              private discussionService: DiscussionService,
              private currentActivatedRoute: ActivatedRoute) {
    this.data = {
      discussionTopic: '',
      link: '',
      description: ''
    };
  }

  async ngOnInit() {

  }

  async goBack() {
    this.router.navigate(['../'], {relativeTo: this.currentActivatedRoute});
  }

  async addNote() {

  }
}
