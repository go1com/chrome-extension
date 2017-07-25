import {Component, Input} from "@angular/core";

@Component({
  selector: 'discussion-item',
  templateUrl: './discussionItem.component.pug',
  styleUrls: ['./discussionItem.component.scss']
})
export class DiscussionItemComponent {
  @Input() discussionItem: any;
}
