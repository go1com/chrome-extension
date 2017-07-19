import {Component, Input} from "@angular/core";

@Component({
  selector: 'discussion-item',
  templateUrl: './discussionItem.component.html',
  styleUrls: ['./discussionItem.component.scss']
})
export class DiscussionItemComponent {
  @Input() discussionItem: any;
}
