
import {Routes} from "@angular/router";
import {UserLoginComponent} from "./userLogin/user-login.component";
import {ForgotPasswordComponent} from "./forgotPassword/forgot-password.component";
import {SignUpComponent} from "./signUp/sign-up.component";
import {ForgotPasswordSuccessComponent} from "./forgotPasswordSuccess/forgot-password-success.component";

let membershipRoutes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: UserLoginComponent},
      {path: 'login', component: UserLoginComponent},
      {path: 'forgotPassword', component: ForgotPasswordComponent},
      {path: 'forgotPasswordSuccess/:email', component: ForgotPasswordSuccessComponent},
      {path: 'signUp', component: SignUpComponent},
    ]
  },
];

export default membershipRoutes;
