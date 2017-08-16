import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DiscussionService} from "../services/discussion.service";
import configuration from "../../../environments/configuration";

@Component({
  selector: 'discussion-detail',
  templateUrl: './discussionDetail.component.pug'
})
export class DiscussionDetailComponent {
  discussionItem: {};
  noteData: any;
  noteReplies: any[];
  noteId: any;
  loading: boolean = false;

  constructor(private currentRoute: ActivatedRoute,
              private discussionService: DiscussionService) {

  }

  async ngOnInit() {
    const pageParams: any = await new Promise((resolve, reject) => {
      this.currentRoute.params.subscribe(params => {
        resolve(params);
      });
    });

    console.log(pageParams);

    const note: any = await  this.discussionService.getUserNote(pageParams.discussionId);

    const keys = Object.keys(note.data);
    const discussionTopic: any = note.data[keys[0]];

    if (!discussionTopic) {
      return;
    }

    discussionTopic.messages = [];

    for (let index = 1; index < keys.length; index++) {
      discussionTopic.messages.push(note.data[keys[index]]);
    }

    this.discussionItem = discussionTopic;
  }
}
