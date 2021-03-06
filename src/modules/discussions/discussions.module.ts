import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {FormsModule} from "@angular/forms";
import {DiscussionsListComponent} from "./discussionsListComponent/discussionsList.component";
import {DiscussionService} from "./services/discussion.service";
import {NewDiscussionComponent} from "./newDiscussionComponent/newDiscussion.component";
import {RouterModule} from "@angular/router";
import {discussionModuleRoutes} from "./discussion.routes";
import {CommonModule} from "@angular/common";
import {DiscussionItemComponent} from "./discussionItemComponent/discussionItem.component";
import {MomentModule} from "angular2-moment";
import {MembershipModule} from "../membership";
import {Go1LinkPreviewModule} from "../../sharedComponents/go1LinkPreview/go1LinkPreview.module";
import {PortalModule} from "../portal/portal.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {DiscussionReplyComponent} from "./discussionReply/discussionReply.component";
import {CurrentChromePageOnlyPipe} from "./services/currentChromePageOnlyPipe";
import {MentionModule} from "../mentionModule/mention.module";
import { NgUploaderModule } from 'ngx-uploader';

@NgModule({
  declarations: [
    DiscussionsListComponent,
    NewDiscussionComponent,
    DiscussionItemComponent,
    DiscussionReplyComponent,
    CurrentChromePageOnlyPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(discussionModuleRoutes),
    MomentModule,

    NgUploaderModule,

    NgbModule,

    Go1CoreModule,
    MembershipModule,
    Go1LinkPreviewModule,
    PortalModule,
    MentionModule
  ],
  providers: [
    DiscussionService
  ],
  exports: [
    DiscussionsListComponent,
    NewDiscussionComponent,
    DiscussionItemComponent,
    DiscussionReplyComponent,
    CurrentChromePageOnlyPipe
  ]
})
export class DiscussionsModule {

}
