import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {UserLoginComponent} from "./userLogin/user-login.component";
import {UserResolve} from "./services/user.resolve";
import {UserService} from "./services/user.service";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import membershipRoutes from "./membership.routes";
import {ForgotPasswordComponent} from "./forgotPassword/forgot-password.component";
import {SignUpComponent} from "./signUp/sign-up.component";
import {ForgotPasswordSuccessComponent} from "./forgotPasswordSuccess/forgot-password-success.component";
import {SignupSuccessComponent} from "./signUpSuccess/signup-success.component";
import {SocialLoginComponent} from "./socialLogin/social-login.component";

@NgModule({
  declarations: [
    UserLoginComponent,
    ForgotPasswordComponent,
    ForgotPasswordSuccessComponent,
    SignUpComponent,
    SignupSuccessComponent,
    SocialLoginComponent
  ],
  imports: [
    FormsModule,
    RouterModule,

    // RouterModule.forChild(membershipRoutes),
    Go1CoreModule
  ],
  providers: [
    UserService,
    UserResolve
  ],
  exports: [
    UserLoginComponent,
    ForgotPasswordComponent,
    ForgotPasswordSuccessComponent,
    SignUpComponent,
    SignupSuccessComponent,
    SocialLoginComponent
  ]
})
export class MembershipModule {

}
