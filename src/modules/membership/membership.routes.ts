
import {Routes} from "@angular/router";
import {UserLoginComponent} from "./userLogin/user-login.component";

let membershipRoutes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: UserLoginComponent},
      {path: 'login', component: UserLoginComponent},
      {path: 'forgotPassword', component: UserLoginComponent},
      {path: 'signUp', component: UserLoginComponent},
    ]
  },
];

export default membershipRoutes;
