import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {NotificationComponent} from "./notificationComponent/notification.component";
import notificationRoutes from "./notification.routes";
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MomentModule,

    RouterModule.forChild(notificationRoutes),
    Go1CoreModule
  ],
  providers: [
  ],
  exports: [
    NotificationComponent
  ]
})
export class NotificationModule {

}
