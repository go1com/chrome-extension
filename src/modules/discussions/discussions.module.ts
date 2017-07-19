import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {DiscussionsListComponent} from "./discussionsListComponent/discussionsList.component";
import {DiscussionService} from "./services/discussion.service";
import {NewDiscussionComponent} from "./newDiscussionComponent/newDiscussion.component";
import {RouterModule} from "@angular/router";
import {discussionModuleRoutes} from "./discussion.routes";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    DiscussionsListComponent,
    NewDiscussionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule.forChild(discussionModuleRoutes),
    Go1CoreModule
  ],
  providers: [
    DiscussionService
  ],
  exports: [
    DiscussionsListComponent,
    NewDiscussionComponent
  ]
})
export class DiscussionsModule {

}
