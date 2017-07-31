import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {AddToPortalService} from "./services/AddToPortalService";
import {MomentModule} from "angular2-moment";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {AddToPortalRoutes} from "./addToPortal.routes";
import {AddToPortalSuccessComponent} from "./addToPortalSuccessComponent/addToPortalSuccess.component";
import {AddToPortalComponent} from "./addToPortalComponent/AddToPortal.component";
import {LearningItemScheduleComponent} from "./saveForLaterComponent/learningItemSchedule.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AddToPortalRoutes),
    MomentModule,


    Go1CoreModule
  ],
  declarations: [
    AddToPortalComponent,
    AddToPortalSuccessComponent,
    LearningItemScheduleComponent
  ],
  providers: [
    AddToPortalService
  ],
  exports: [
    AddToPortalComponent,
    AddToPortalSuccessComponent,
    LearningItemScheduleComponent
  ]
})
export class AddToPortalModule {

}
