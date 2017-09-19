import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BackgroundNotificationService} from "./backgroundNotification.service";
import {Go1CoreModule} from "../../modules/go1core/go1core.module";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    Go1CoreModule
  ],
  exports: [
  ],
  providers: [
    BackgroundNotificationService
  ]
})
export class BackgroundNotificationModule {

}
