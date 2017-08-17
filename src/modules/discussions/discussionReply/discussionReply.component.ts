import {Component, Input} from "@angular/core";

@Component({
  selector: 'discussion-reply',
  templateUrl: './discussionReply.component.pug'
})
export class DiscussionReplyComponent {
  @Input() reply: any;

  constructor() {

  }
}
