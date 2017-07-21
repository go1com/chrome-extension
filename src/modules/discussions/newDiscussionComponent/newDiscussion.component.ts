import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";
import {UserService} from "../../membership/services/user.service";

@Component({
  selector: 'app-new-discussion',
  templateUrl: './newDiscussion.component.html',
  styleUrls: ['./newDiscussion.component.scss']
})
export class NewDiscussionComponent implements OnInit {
  data: any;
  private user: any;

  constructor(private router: Router,
              private discussionService: DiscussionService,
              private currentActivatedRoute: ActivatedRoute,
              private userService: UserService) {
    this.data = {
      title: '',
      link: '',
      body: '',
      entityType: 'portal',
      entityId: localStorage.getItem('activeInstance')
    };
  }

  async ngOnInit() {
    this.data.user = this.userService.getUser();
    console.log(this.data);
  }

  async goBack() {
    this.router.navigate(['../'], {relativeTo: this.currentActivatedRoute});
  }

  async addNote() {
    await this.discussionService.createNote(this.data);
    await this.goBack();
  }
}
