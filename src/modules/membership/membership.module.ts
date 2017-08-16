import {NgModule} from "@angular/core";
import {Go1CoreModule} from "../go1core/go1core.module";
import {UserLoginComponent} from "./userLogin/user-login.component";
import {UserResolve} from "./services/user.resolve";
import {UserService} from "./services/user.service";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ForgotPasswordComponent} from "./forgotPassword/forgot-password.component";
import {SignUpComponent} from "./signUp/sign-up.component";
import {ForgotPasswordSuccessComponent} from "./forgotPasswordSuccess/forgot-password-success.component";
import {SignupSuccessComponent} from "./signUpSuccess/signup-success.component";
import {SocialLoginComponent} from "./socialLogin/social-login.component";
import {UserAvatarComponent} from "./userAvatarComponent/userAvatar.component";
import {CommonModule} from "@angular/common";
import {UserProfileComponent} from "./userProfileComponent/userProfile.component";

@NgModule({
  declarations: [
    UserLoginComponent,
    ForgotPasswordComponent,
    ForgotPasswordSuccessComponent,
    SignUpComponent,
    SignupSuccessComponent,
    SocialLoginComponent,
    UserAvatarComponent,
    UserProfileComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
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
    SocialLoginComponent,
    UserAvatarComponent,
    UserProfileComponent
  ]
})
export class MembershipModule {

}
