import {Component, Input} from "@angular/core";
import {ModalDialogService} from "../../go1core/services/ModalDialogService";

@Component({
  selector: 'discussion-item',
  templateUrl: './discussionItem.component.pug',
  styleUrls: ['./discussionItem.component.scss']
})
export class DiscussionItemComponent {
  @Input() discussionItem: any;

  constructor(private modalDialogService: ModalDialogService) {

  }

  async deleteItem() {
    const confirm = await this.modalDialogService.showConfirmation(
      'This action can not be undone. Are you sure you want to remove this discussion?',
      'Delete Discussion',
      'Yes, Delete It',
      'No',
      'btn-danger'
    );
  }
}
