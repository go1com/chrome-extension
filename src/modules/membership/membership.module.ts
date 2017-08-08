import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {UserLoginComponent} from "./userLogin/user-login.component";
import {UserResolve} from "./services/user.resolve";
import {UserService} from "./services/user.service";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import membershipRoutes from "./membership.routes";

@NgModule({
  declarations: [
    UserLoginComponent
  ],
  imports: [
    FormsModule,
    RouterModule,

    RouterModule.forChild(membershipRoutes),
    Go1CoreModule
  ],
  providers: [
    UserService,
    UserResolve
  ],
  exports: [
    UserLoginComponent
  ]
})
export class MembershipModule {

}
