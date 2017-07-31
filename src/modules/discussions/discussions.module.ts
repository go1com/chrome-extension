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
import {MembershipModule} from "../membership/membership.module";
import {Go1LinkPreviewModule} from "../../sharedComponents/go1LinkPreview/go1LinkPreview.module";

@NgModule({
  declarations: [
    DiscussionsListComponent,
    NewDiscussionComponent,
    DiscussionItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(discussionModuleRoutes),
    MomentModule,

    Go1CoreModule,
    MembershipModule,
    Go1LinkPreviewModule
  ],
  providers: [
    DiscussionService
  ],
  exports: [
    DiscussionsListComponent,
    NewDiscussionComponent,
    DiscussionItemComponent
  ]
})
export class DiscussionsModule {

}
