import {Component, Input, OnInit} from "@angular/core";
import {ModalDialogService} from "../../go1core/services/ModalDialogService";
import {DiscussionService} from "../services/discussion.service";
import {Router} from "@angular/router";
import configuration from "../../../environments/configuration";
import {UserService} from "../../membership/services/user.service";
import {commandKeys} from "../../../environments/commandKeys";
import {BrowserMessagingService} from "../../go1core/services/BrowserMessagingService";

@Component({
  selector: 'app-discussion-item',
  templateUrl: './discussionItem.component.pug',
  styleUrls: ['./discussionItem.component.scss']
})
export class DiscussionItemComponent implements OnInit {
  postingReply: boolean;
  @Input() discussionItem: any;
  readMoreLength = 75;

  replyMessage = '';
  discussionStarted = false;

  constructor(private modalDialogService: ModalDialogService,
              private userService: UserService,
              private browserMessagingService: BrowserMessagingService,
              private discussionService: DiscussionService) {
  }

  ngOnInit() {
    this.discussionItem.noteItem.context.id = this.discussionItem.noteItem.id;
    this.discussionItem.noteItem.context.uuid = this.discussionItem.noteItem.uuid;
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

  shouldShowReadMore() {
    return this.discussionItem && this.discussionItem.quote && this.discussionItem.quote.length > this.readMoreLength;
  }

  async jumpToQuotedText() {
    if (!this.discussionItem.noteItem.context.quotation) {
      return;
    }

    await this.browserMessagingService.requestToTab(configuration.currentChromeTab.id, commandKeys.jumpToQuotedText, this.discussionItem.noteItem.context);
  }

  async removeQuoteHighlight() {
    console.log('remove highlight');
    if (!this.discussionItem.noteItem.context.quotation) {
      return;
    }

    await this.browserMessagingService.requestToTab(configuration.currentChromeTab.id, commandKeys.removeAllHighlight, this.discussionItem.noteItem.context);
  }

  toggleDiscussion() {
    this.discussionStarted = !this.discussionStarted;
  }

  async addReply() {
    let user: any = await this.userService.getUser();

    let noteReplydata = {
      message: this.replyMessage,
      user_id: user.id,
      created: new Date().getTime()
    };

    this.postingReply = true;
    await this.discussionService.addMessage(this.discussionItem.noteItem.uuid, noteReplydata);
    this.replyMessage = '';
    this.postingReply = false;
  }
}
