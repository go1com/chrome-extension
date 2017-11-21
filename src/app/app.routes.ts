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
import {DiscussionsListComponent} from "../modules/discussions/discussionsListComponent/discussionsList.component";
import {NewDiscussionComponent} from "../modules/discussions/newDiscussionComponent/newDiscussion.component";
import {AddToPortalSuccessComponent} from "../modules/addToPortal/addToPortalSuccessComponent/addToPortalSuccess.component";
import {routeNames} from "../modules/addToPortal/addToPortal.routes";
import {LearningItemScheduleComponent} from "../modules/addToPortal/saveForLaterComponent/learningItemSchedule.component";
import {ShareLearningItemComponent} from "../modules/addToPortal/shareLearningItemComponent/shareLearningItem.component";
import {AddToPortalComponent} from "../modules/addToPortal/addToPortalComponent/AddToPortal.component";

export const routes: Routes = [
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
    // loadChildren: '../modules/discussions#DiscussionsModule'
    children: [
      {path: '', component: DiscussionsListComponent},
      {path: configuration.pages.discussionsList, component: DiscussionsListComponent},
      {path: 'newDiscussion', component: NewDiscussionComponent},
    ]

  },
  {
    path: configuration.pages.addToPortal,
    // loadChildren: '../modules/addToPortal#AddToPortalModule'
    children: [
      {path: '', component: AddToPortalComponent},
      {path: configuration.pages.addToPortal, component: AddToPortalComponent},
      {path: `${configuration.pages.shareLearningItem}/:learningItemId`, component: ShareLearningItemComponent},
      {path: `${configuration.pages.scheduleLearningItem}/:learningItemId`, component: LearningItemScheduleComponent},
      {path: routeNames.success, component: AddToPortalSuccessComponent},
      {path: `${routeNames.success}/:learningItemId`, component: AddToPortalSuccessComponent}
    ]
  },
  // {
  //   path: configuration.pages.notifications,
  //   loadChildren: '../modules/notification#NotificationModule'
  // },
  {
    path: 'setting',
    component: SettingComponent
  }
];
