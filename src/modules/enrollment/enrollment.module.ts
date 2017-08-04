import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {EnrollmentService} from "./services/enrollment.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    Go1CoreModule
  ],
  providers: [
    EnrollmentService
  ]
})
export class EnrollmentModule {

}
