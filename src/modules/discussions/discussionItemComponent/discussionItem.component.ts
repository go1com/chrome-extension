import {Component, Input} from "@angular/core";
import {ModalDialogService} from "../../go1core/services/ModalDialogService";
import {DiscussionService} from "../services/discussion.service";
import {Router} from "@angular/router";
import configuration from "../../../environments/configuration";

@Component({
  selector: 'discussion-item',
  templateUrl: './discussionItem.component.pug',
  styleUrls: ['./discussionItem.component.scss']
})
export class DiscussionItemComponent {
  @Input() discussionItem: any;

  constructor(private modalDialogService: ModalDialogService,
              private router: Router,
              private discussionService: DiscussionService) {
  }

  ngOnInit() {
    console.log(this.discussionItem);
  }

  async deleteItem() {
    const confirm = await this.modalDialogService.showConfirmation(
      'This action can not be undone. Are you sure you want to remove this discussion?',
      'Delete Discussion',
      'Yes, Delete It',
      'No',
      'btn-danger'
    );

    if (confirm) {
      await this.discussionService.deleteNote(this.discussionItem.noteItem.uuid);
      this.discussionService.onNoteDeleted.emit(this.discussionItem.noteItem.uuid);
    }
  }

  async goToDiscussionDetail() {
    await this.router.navigate([configuration.pages.discussionModule, configuration.pages.discussionDetail, this.discussionItem.noteItem.uuid]);
  }
}
