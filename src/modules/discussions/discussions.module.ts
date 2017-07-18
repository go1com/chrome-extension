import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {DiscussionsListComponent} from "./discussionsListComponent/discussionsList.component";
import {DiscussionService} from "./services/discussion.service";

@NgModule({
  declarations: [
    DiscussionsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Go1CoreModule
  ],
  providers: [
    DiscussionService
  ],
  exports: [
    DiscussionsListComponent
  ]
})
export class DiscussionsModule {

}
