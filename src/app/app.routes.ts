import {CompleteComponent} from "./complete/complete.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {LearnerDashboardComponent} from "./learner-dashboard/learner-dashboard.component";
import {PortalsComponent} from "./portals/portals.component";

import {SettingComponent} from "../modules/settings/setting/setting.component";

import {RedirectingComponent} from "./redirectingComponent/redirecting.component";
import {Routes} from "@angular/router";
import {UserLoginComponent} from "../modules/membership/userLogin/user-login.component";
import {ForgotPasswordComponent} from "../modules/membership/forgotPassword/forgot-password.component";
import {ForgotPasswordSuccessComponent} from "../modules/membership/forgotPasswordSuccess/forgot-password-success.component";
import {SignUpComponent} from "../modules/membership/signUp/sign-up.component";
import {SignupSuccessComponent} from "../modules/membership/signUpSuccess/signup-success.component";
import {SocialLoginComponent} from "../modules/membership/socialLogin/social-login.component";
import configuration from "../environments/configuration";

let routes: Routes = [
  {
    path: '',
    component: RedirectingComponent,
  },
  {
    path: 'membership',
    children: [
      {path: 'login', component: UserLoginComponent},
      {path: 'forgotPassword', component: ForgotPasswordComponent},
      {path: 'forgotPasswordSuccess/:email', component: ForgotPasswordSuccessComponent},
      {path: 'signUp', component: SignUpComponent},
      {path: 'signUpSuccess/:email', component: SignupSuccessComponent},
      {path: 'socialLogin/:oauthProvider', component: SocialLoginComponent}
    ]
  },
  {
    path: configuration.pages.discussionsList,
    loadChildren: '../modules/discussions#DiscussionsModule'
  },
  {
    path: configuration.pages.addToPortal,
    loadChildren: '../modules/addToPortal#AddToPortalModule'
  },
  {
    path: configuration.pages.notifications,
    loadChildren: '../modules/notification#NotificationModule'
  },
  {
    path: 'portals',
    component: PortalsComponent
  },
  {
    path: 'learner-dashboard',
    component: LearnerDashboardComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    // resolve: {
    //   user: UserResolve
    // }
  },
  {
    path: 'complete',
    component: CompleteComponent,
  },
  {
    path: 'setting',
    component: SettingComponent
  }
];

export default routes;
