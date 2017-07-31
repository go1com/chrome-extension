import {CompleteComponent} from "./complete/complete.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {LearnerDashboardComponent} from "./learner-dashboard/learner-dashboard.component";
import {PortalsComponent} from "./portals/portals.component";

import {UserLoginComponent} from "../modules/membership/userLogin/user-login.component";

import {SettingComponent} from "../modules/settings/setting/setting.component";
import {Routes} from "@angular/router";

let routes: Routes = [
  {
    path: '',
    component: UserLoginComponent
  },
  {
    path: 'discussions-list',
    loadChildren: '../modules/discussions#DiscussionsModule'
  },
  {
    path: 'addToPortal',
    loadChildren: '../modules/addToPortal#AddToPortalModule'
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
