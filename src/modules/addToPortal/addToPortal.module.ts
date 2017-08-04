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
import {PortalModule} from "../portal/portal.module";
import {TagInputModule} from "../../sharedComponents/tagInput/tag-input.module";
import {EnrollmentModule} from "../enrollment/enrollment.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AddToPortalRoutes),
    MomentModule,

    TagInputModule,

    Go1CoreModule,
    PortalModule,
    EnrollmentModule
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
